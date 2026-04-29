const express = require("express");
const router = express.Router();
const Order = require("../models/Orders");
const MenuItem = require("../models/MenuItem");
const Tables = require("../models/Table");
const User = require("../models/User");
const UserType = require("../models/UserType");
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

const getLeastBusyWaiter = async () => {
  const waiterType = await UserType.findOne({ 
usertype: "Waiter Staff" });

  if (!waiterType) return null;

  const waiters = await User.find({
    userTypeId: waiterType._id,
    active: true,
    deleted: false
  });

  if (!waiters.length) return null;

  const activeOrders = await Order.aggregate([
    {
      $match: {
        Status: { $nin: ["Completed", "Cancelled"] }
      }
    },
    {
      $group: {
        _id: "$OrderBy",
        count: { $sum: 1 }
      }
    }
  ]);

  const loadMap = new Map();
  activeOrders.forEach(o => {
    loadMap.set(String(o._id), o.count);
  });

  let minLoad = Infinity;
  let candidates = [];

  waiters.forEach(w => {
    const load = loadMap.get(String(w._id)) || 0;

    if (load < minLoad) {
      minLoad = load;
      candidates = [w];
    } else if (load === minLoad) {
      candidates.push(w);
    }
  });

  return candidates[Math.floor(Math.random() * candidates.length)];
};
// ================= CREATE ORDER =================
router.post("/add", async (req, res) => {
  console.log("🔥 ORDER REQUEST:", req.body);

  try {
    const {
      TableNo,
      Order: orderItems,
      Status,
      PaymentMethod,
      PaymentStatus,
      Note,
      CustomerName
    } = req.body;

    // =========================
    // 1. VALIDATION
    // =========================
    if (!TableNo) {
      return res.status(400).json({ message: "TableNo is required" });
    }

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: "Order items required" });
    }

    // =========================
    // 2. FIND TABLE
    // =========================
    const table = await Tables.findOne({ Tnumber: TableNo });

    if (!table) {
      return res.status(400).json({ message: "Invalid table" });
    }

    let waiterId = table.assignedWaiter;

    // =========================
    // 3. AUTO ASSIGN WAITER
    // =========================
    if (!waiterId) {
      const waiter = await getLeastBusyWaiter();

      if (!waiter) {
        return res.status(400).json({ message: "No waiters available" });
      }

      waiterId = waiter._id;

      table.assignedWaiter = waiterId;

      if (global.io) {
        global.io.emit("waiterAssigned", {
          waiterId,
          tableNo: TableNo
        });
      }
    }

    // =========================
    // 4. OCCUPY TABLE IMMEDIATELY
    // =========================
    table.status = "Occupied";
    table.occupiedAt = new Date();
    await table.save();

    if (global.io) {
      global.io.emit("tableUpdated", {
        type: "TABLE_OCCUPIED",
        table
      });
    }

    // =========================
    // 5. CREATE ORDER (FIXED)
    // =========================
    const newOrder = new Order({
      TableNo,
      Order: orderItems,

      Status: Status || "Pending",

      // 🔥 FIXED: NO DEFAULT BUG
      PaymentMethod: PaymentMethod || "CASH",
      PaymentStatus: PaymentStatus || "PENDING",

      Note: Note || "",
      CustomerName: CustomerName || "",
      OrderBy: waiterId
    });

    const saved = await newOrder.save();

    // =========================
    // 6. SOCKET EVENTS
    // =========================
    if (global.io) {
      global.io.emit("newOrder", {
        waiterId,
        order: saved
      });
    }
   global.io.emit("orderUpdated", {
  type: "NEW_ORDER",
  data: saved
});

    return res.status(200).json({
      success: true,
      data: saved
    });

  } catch (err) {
    console.error("ORDER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message
    });
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

    // get current order first
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // decide next status
    let nextStatus = order.Status;

    if (order.Status === "Served") {
      nextStatus = "Confirmed";
    }

    order.PaymentMethod = method;
    order.PaymentStatus = "PAID";
    order.Status = nextStatus;

    await order.save();

    global.io.emit("orderUpdated", {
      type: "PAYMENT_DONE",
      data: order
    });

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
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
    const data = await Order.find({
      deleted: false,
      active: true
    })
      .populate("Order.ItemID", "name price")
      .populate("OrderBy", "name")   // 🔥 IMPORTANT FIX
      .sort({ createdDateTime: -1 });

    res.json(data);
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
    console.log("🔥 VERIFY PAYMENT HIT:", req.params.id);

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.PaymentMethod = "ONLINE";
    order.PaymentStatus = "PAID";
    order.Status = "CONFIRMED";
    order.paidAt = new Date();

    const saved = await order.save();

    if (global.io) {
      global.io.emit("orderUpdated", {
        type: "PAYMENT_VERIFIED",
        data: saved
      });
    }

    res.json(saved);

  } catch (err) {
    console.error("VERIFY PAYMENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});
router.put("/served/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // If paid -> complete order
    if (order.PaymentStatus === "PAID") {
      order.Status = "Completed";
    } else {
      // If unpaid -> only served
      order.Status = "Served";
    }

    await order.save();

    global.io.emit("orderUpdated", {
      type: "ORDER_SERVED",
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
router.get("/invoice/:tableNo", async (req, res) => {
  try {
    const tableNo = req.params.tableNo;

    const orders = await Order.find({
      TableNo: tableNo
    }).populate("Order.ItemID");

    const table = await Tables.findOne({ Tnumber: tableNo })
      .populate("assignedWaiter");

    let html = `
      <h1>Invoice</h1>
      <p>Table No: ${tableNo}</p>
      <p>Waiter: ${table.assignedWaiter?.name || "N/A"}</p>
      <p>Date: ${new Date().toLocaleString()}</p>
      <hr/>
    `;

    let grand = 0;

    orders.forEach(order => {
      let total = 0;

      html += `<h3>Order #${order._id.toString().slice(-4)}</h3>`;

      order.Order.forEach(i => {
        const price = i.ItemID?.price || 0;
        const sub = price * i.ItemQty;

        total += sub;
        grand += sub;

        html += `
          <p>
          ${i.ItemID?.name}
          x ${i.ItemQty}
          = ₹${sub}
          </p>
        `;
      });

      html += `<b>Total: ₹${total}</b><hr/>`;
    });

    html += `
      <h2>Grand Total ₹${grand}</h2>
      <img src="QR_IMAGE_LINK"/>
    `;

    res.json({
      pdf: "http://localhost:5000/invoice/sample.pdf"
    });

  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/invoice/order/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("OrderBy", "name")
      .populate("Order.ItemID", "name price");

    res.json(order);

  } catch (err) {
    res.status(500).json(err);
  }
});
// ALL ORDERS
router.get("/all", async (req, res) => {
  try {
    const data = await Order.find({
      deleted: false,
      active: true
    })
      .populate("OrderBy", "name email")
      .populate("Order.ItemID", "name price")
      .sort({ createdDateTime: -1 });

    res.json(data);

  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/category-sales", async (req, res) => {
  try {
    const data = await Order.find({
      deleted: false,
      active: true,
      Status: "Completed"
    })
      .populate("OrderBy", "name")
      .populate({
        path: "Order.ItemID",
        model: "ismenuitem",
        populate: {
          path: "menucategoryId",
          model: "ismenucategories",
          select: "name"
        }
      })
      .sort({ createdDateTime: -1 });

    res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// SINGLE ORDER DETAILS
router.get("/details/:id", async (req, res) => {
  try {
    const data = await Order.findById(req.params.id)
      .populate("OrderBy", "name email mobile")
      .populate("Order.ItemID", "name price");

    res.json(data);

  } catch (err) {
    res.status(500).json(err);
  }
});
// Example Express Route
// ================================================
// FULL UPDATED /dashboard/summary
// FIXED FOR YOUR ORDER SCHEMA
// Uses Order[] items because no TotalAmount field
// ================================================

router.get("/dashboard/summary", async (req, res) => {
  try {
    // ============================================
    // DATES
    // ============================================
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentYear = new Date().getFullYear();

    // ============================================
    // BASIC COUNTS
    // ============================================
    const totalOrders = await Order.countDocuments({
      deleted: false,
      active: true
    });

    const todayOrders = await Order.countDocuments({
      deleted: false,
      active: true,
      createdDateTime: { $gte: today }
    });

    const activeTables = await Tables.countDocuments({
      status: "Occupied"
    });

    const totalUsers = await User.countDocuments({
      deleted: false,
      active: true
    });

    // ============================================
    // TOTAL REVENUE
    // ============================================
    const paidOrders = await Order.find({
      deleted: false,
      active: true,
      PaymentStatus: "PAID"
    }).populate("Order.ItemID", "price");

    let totalRevenue = 0;

    paidOrders.forEach((order) => {
      order.Order.forEach((item) => {
        const price = item.ItemID?.price || 0;
        totalRevenue += price * item.ItemQty;
      });
    });

    // ============================================
    // MONTHLY REVENUE
    // ============================================
    const monthNames = [
      "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    let monthlyMap = {};

    paidOrders.forEach((order) => {
      const d = new Date(order.createdDateTime);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;

      let amount = 0;

      order.Order.forEach((item) => {
        const price = item.ItemID?.price || 0;
        amount += price * item.ItemQty;
      });

      monthlyMap[key] = (monthlyMap[key] || 0) + amount;
    });

    const monthlyRevenue = Object.keys(monthlyMap)
      .sort()
      .map((key) => {
        const [year, month] = key.split("-");
        return {
          month: `${monthNames[month]} ${year}`,
          total: monthlyMap[key]
        };
      });

    // ============================================
    // TOP ITEMS
    // ============================================
    const topItems = await Order.aggregate([
      {
        $match: {
          deleted: false,
          active: true
        }
      },
      { $unwind: "$Order" },
      {
        $lookup: {
          from: "ismenuitems",
          localField: "Order.ItemID",
          foreignField: "_id",
          as: "menu"
        }
      },
      { $unwind: "$menu" },
      {
        $group: {
          _id: "$menu.name",
          qty: { $sum: "$Order.ItemQty" }
        }
      },
      { $sort: { qty: -1 } },
      { $limit: 5 }
    ]);

    const formattedItems = topItems.map((x) => ({
      name: x._id,
      qty: x.qty
    }));

    // ============================================
    // ORDER STATUS
    // ============================================
    const statusCounts = await Order.aggregate([
      {
        $match: {
          deleted: false,
          active: true
        }
      },
      {
        $group: {
          _id: "$Status",
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStatus = statusCounts.map((x) => ({
      status: x._id,
      count: x.count
    }));

    // ============================================
    // FINAL RESPONSE
    // ============================================
    res.json({
      stats: {
        totalRevenue,
        totalOrders,
        activeTables,
        totalUsers,
        todayOrders
      },

      monthlyRevenue,
      topItems: formattedItems,
      statusCounts: formattedStatus
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});
// UPDATE STATUS SOCKET


module.exports = router;