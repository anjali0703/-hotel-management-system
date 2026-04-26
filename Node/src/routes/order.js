const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const MenuItem = require("../models/MenuItem");
const Tables = require("../models/Table");

// ================= CALCULATE BILL =================
const calculateBill = async (orderItems) => {
  let subTotal = 0;

  const itemsWithPrice = await Promise.all(
    orderItems.map(async (item) => {
      const menu = await MenuItem.findById(item.ItemID);

      const price = menu?.price || 0;
      const total = price * item.ItemQty;

      subTotal += total;

      return {
        ItemID: item.ItemID,
        ItemName: menu?.name,
        ItemPrice: price,
        ItemQty: item.ItemQty,
        Total: total,
        Status: item.Status || "Pending",
        Note: item.Note || ""
      };
    })
  );

  const tax = subTotal * 0.05; // 5% tax
  const grandTotal = subTotal + tax;

  return { itemsWithPrice, subTotal, tax, grandTotal };
};

// ================= CREATE ORDER =================
router.post("/add", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const {
      TableNo,
      Order: orderItems,
      Status,
      PaymentMethod,
      Note,
      OrderBy
    } = req.body;

    if (!Status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // ✅ ONLY KEEP VALID FIELDS (IMPORTANT)
    const cleanOrder = orderItems.map(item => ({
      ItemID: item.ItemID,
      ItemQty: item.ItemQty,
      Status: item.Status || "Pending",
      Note: item.Note || ""
    }));

    const newOrder = new Order({
      TableNo,
      Order: cleanOrder,
      Status,
      PaymentMethod,
      Note,
      OrderBy
    });

  const saved = await newOrder.save();

// ✅ UPDATE TABLE STATUS
await Tables.updateOne(
  { Tnumber: TableNo },
  { status: "Occupied" }
);

// 🔥 EMIT EVENT
global.io.emit("orderUpdated", {
  type: "NEW_ORDER",
  data: saved
});

    res.status(200).json(saved);

  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ================= UPDATE ORDER =================
router.put("/update/:id", async (req, res) => {
  try {
    const { Order: orderItems } = req.body;

    const { itemsWithPrice, subTotal, tax, grandTotal } =
      await calculateBill(orderItems);

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      {
        Order: itemsWithPrice,
        SubTotal: subTotal,
        Tax: tax,
        GrandTotal: grandTotal
      },
      { new: true }
    );

    global.io.emit("orderUpdated", {
      type: "UPDATE_ORDER",
      data: updated
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ================= MARK AS PAID =================
router.put("/pay/:id", async (req, res) => {
  try {
    const { method } = req.body;

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      {
        PaymentMethod: method,
        PaymentStatus: "Paid",
        Status: "Completed"
      },
      { new: true }
    );

    global.io.emit("orderUpdated", {
      type: "PAYMENT_DONE",
      data: updated
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ================= DELETE ORDER =================
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Order.findByIdAndUpdate(
      req.params.id,
      { deleted: true, active: false },
      { new: true }
    );

    global.io.emit("orderUpdated", {
      type: "DELETE_ORDER",
      data: deleted
    });

    res.json(deleted);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ================= GET ALL =================
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({ active: true }).sort({ createdDateTime: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ================= GET BY TABLE =================
router.get("/table/:tableNo", async (req, res) => {
  try {
    const orders = await Order.find({
      TableNo: req.params.tableNo,
      active: true
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.put("/status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { Status: status },
      { new: true }
    );

    // 🔥 EMIT TO ALL
    global.io.emit("orderUpdated", {
      type: "STATUS_CHANGED",
      data: updated
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.post("/create", async (req, res) => {
  try {
    const { tableNo, items, paymentType, totalAmount } = req.body;

    const table = await Tables.findOne({ tableNo });

    const order = await Order.create({
      tableNo,
      items,
      paymentType,
      status: paymentType === "ONLINE" ? "Paid" : "Pending",
      totalAmount,
      createdAt: new Date()
    });

    // 🔥 SOCKET TO WAITER
    if (table?.assignedWaiter) {
      global.io.emit("orderUpdated", {
        type: "NEW_ORDER",
        data: {
          tableNo,
          paymentType,
          status: order.status,
          totalAmount
        },
        waiterId: table.assignedWaiter
      });
    }

    // 💳 ONLINE PAYMENT FLOW
    if (paymentType === "ONLINE") {
      return res.json({
        paymentUrl: "https://your-payment-gateway.com/qr/" + order._id
      });
    }

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/initiate-payment", async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId); // just fetch

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  global.io.emit("paymentInitiated", {
    orderId: order._id,
    tableNo: order.TableNo,
    amount: order.TotalAmount,
    waiterId: order.assignedWaiter
  });

  res.json({ message: "Payment request sent", orderId });
});
router.put("/verify-payment/:id", async (req, res) => {
  try {
    const { method } = req.body; // ONLINE / CASH

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.PaymentStatus = "PAID";
    order.PaymentMethod = method || "ONLINE";
    order.Status = "CONFIRMED";

    await order.save();

    global.io.emit("orderUpdated", {
      type: "ORDER_CONFIRMED",
      data: order
    });

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put("/pay/cash/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      PaymentMethod: "CASH",
      PaymentStatus: "PAID",
      Status: "CONFIRMED"
    },
    { new: true }
  );

  global.io.emit("orderUpdated", {
    type: "PAYMENT_DONE",
    data: order
  });

  res.json(order);
});
module.exports = router;