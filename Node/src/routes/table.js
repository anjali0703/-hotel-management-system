const express = require("express");
const router = express.Router();
const Tables = require("../models/Table"); 
const Order = require("../models/Orders");
const Users = require("../models/User"); 
const QRCode = require("qrcode");

// =======================
// ✅ CREATE / UPDATE
// =======================
router.post("/save", async (req, res) => {
  try {
    const { id, Tnumber, capacity, status, active, userId } = req.body;

    if (id) {
      // UPDATE
      const updated = await Tables.findByIdAndUpdate(
        id,
        {
          Tnumber,
          capacity,
          status,
          active,
          modifiedDateTime: new Date(),
          modifiedBy: userId
        },
        { new: true }
      );

      return res.json({ success: true, data: updated });
    } else {
      // CREATE
      const newTable = new Tables({
        Tnumber,
        capacity,
        status,
        active,
        createdBy: userId
      });

      const saved = await newTable.save();
      return res.json({ success: true, data: saved });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.get("/dashboard", async (req, res) => {
  try {
    // 1. get all active tables
    const tables = await Tables.find({ active: true, deleted: false });

    // 2. get all active orders
    const orders = await Order.find({ active: true })
      .populate("Order.ItemID")
      .populate("OrderBy");

    // 3. build dashboard
    const dashboard = tables.map((table) => {

      // FIX: support both naming styles safely
      const tableNumber = table.TableNo || table.Tnumber;

      const tableOrders = orders.filter(
        (o) => String(o.TableNo) === String(tableNumber)
      );

      const isOccupied =table.status==="Occupied";

const isPaid =
  tableOrders.length > 0 &&
  tableOrders.some((o) => o.Status === "Completed");

      const totalItems = tableOrders.reduce((sum, order) => {
        return sum + order.Order.reduce((s, i) => s + i.ItemQty, 0);
      }, 0);

      return {
        tableId: table._id,
        tableNo: tableNumber,
        status: isOccupied ? "Occupied" : "Available",
        assignedWaiter: table.assignedWaiter, 
        orders: tableOrders,
        totalOrders: tableOrders.length,
        totalItems,
        isPaid,
      };
    });

    res.status(200).json(dashboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});
// =======================
// ✅ GET ALL (NOT DELETED)
// =======================
router.get("/", async (req, res) => {
  try {
    const data = await Tables.find({ deleted: false })
      .populate("createdBy modifiedBy deletedBy", "name");

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =======================
// ✅ GET BY ID
// =======================
router.get("/:id", async (req, res) => {
  try {
    const data = await Tables.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================
// ✅ SOFT DELETE
// =======================
router.delete("/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    const deleted = await Tables.findByIdAndUpdate(
      req.params.id,
      {
        deleted: true,
        deletedDateTime: new Date(),
        deletedBy: userId
      },
      { new: true }
    );

    res.json({ success: true, data: deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================
// ✅ TOGGLE ACTIVE
// =======================
router.patch("/toggle-active/:id", async (req, res) => {
  try {
    const { active, userId } = req.body;

    const updated = await Tables.findByIdAndUpdate(
      req.params.id,
      {
        active,
        modifiedDateTime: new Date(),
        modifiedBy: userId
      },
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// =======================
// ✅ CLEAN TABLE (MAKE AVAILABLE)
// =======================
router.put("/clean/:tableNo", async (req, res) => {
  try {
    const tableNo = req.params.tableNo;

    // single update (clean table properly)
    const updated = await Tables.findOneAndUpdate(
      { Tnumber: tableNo },
      {
        status: "Available",
        assignedWaiter: null,
        occupiedAt: null,
        modifiedDateTime: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Table not found" });
    }

    // 🔥 SOCKET: broadcast to ALL waiters
    if (global.io) {
      global.io.emit("tableUpdated", {
        type: "TABLE_CLEANED",
        table: updated,   // send updated table data
      });
    }

    return res.json({
      success: true,
      message: "Table cleaned successfully",
      data: updated,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/generate-qr", async (req, res) => {
  try {
    const tables = await Tables.find({ deleted: false });

    const BASE_URL = "https://yourdomain.com/MenuItems";

    const updatedTables = await Promise.all(
      tables.map(async (table) => {
        const tableNo = table.Tnumber;

        const url = `${BASE_URL}?table=${tableNo}`;

        const qr = await QRCode.toDataURL(url);

        table.qrCode = qr;
        await table.save();

        return {
          tableNo,
          qrCode: qr
        };
      })
    );

    res.json(updatedTables);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
// =======================
// ✅ GENERATE QR FOR TABLE
// =======================
router.get("/qr/:tableNo", async (req, res) => {
  try {
    const tableNo = req.params.tableNo;

    // 👉 This is your frontend URL (CHANGE if needed)
    const url = `http://localhost:3000/MenuItems?table=${tableNo}`;

    const qr = await QRCode.toDataURL(url);

    res.json({
      success: true,
      tableNo,
      qr
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// =======================
// ✅ AUTO ASSIGN TABLE + WAITER
// =======================
router.post("/assign/:tableNo", async (req, res) => {
  try {
    const tableNo = req.params.tableNo;

    // 1️⃣ find table
    const table = await Tables.findOne({ Tnumber: tableNo });

    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    if (table.status === "Occupied") {
      return res.json({ message: "Already occupied" });
    }

    // 2️⃣ find waiter with least tables
    const waiters = await Users.find({
      userTypeId: process.env.REACT_APP_ROLE_WAITER
    });

    const tables = await Tables.find({ status: "Occupied" });

    let waiterLoad = {};

    waiters.forEach(w => {
      waiterLoad[w._id] = 0;
    });

    tables.forEach(t => {
      if (t.assignedWaiter) {
        waiterLoad[t.assignedWaiter] += 1;
      }
    });

    let selectedWaiter = waiters[0];

    for (let w of waiters) {
      if (waiterLoad[w._id] < waiterLoad[selectedWaiter._id]) {
        selectedWaiter = w;
      }
    }

    // 3️⃣ update table
    const updated = await Tables.findOneAndUpdate(
      { Tnumber: tableNo },
      {
        status: "Occupied",
        assignedWaiter: selectedWaiter._id,
        occupiedAt: new Date()
      },
      { new: true }
    );

    // 4️⃣ emit socket
    global.io.emit("tableAssigned", {
      tableNo,
      waiterId: selectedWaiter._id
    });

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put("/assign-manual/:tableNo", async (req, res) => {
  try {
    const tableNo = req.params.tableNo;
    const { waiterId } = req.body;

    const updated = await Tables.findOneAndUpdate(
      { Tnumber: tableNo },
      {
        status: "Occupied",
        assignedWaiter: waiterId,
        occupiedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Table not found" });
    }

    // 🔥 realtime update
    global.io.emit("tableUpdated", {
      type: "TABLE_ASSIGNED",
      table: updated,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;