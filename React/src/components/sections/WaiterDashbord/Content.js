import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./waiterDashboard.css";
import toastr from "toastr";
import { socket } from "../../../socket";
import { useAuth } from "../../../contexts/AuthContext";
const WaiterDashboard = () => {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const API = process.env.REACT_APP_API_URL;
useEffect(() => {
  if (!user) return;

  fetchTables();

socket.on("tableUpdated", (payload) => {
  const updated = payload.table;

  if (!updated) return;

  setTables((prev) =>
    prev.map((t) =>
      String(t.tableNo) === String(updated.Tnumber)
        ? {
            ...t,
            ...updated,
            tableNo: updated.Tnumber // normalize
          }
        : t
    )
  );

  if (payload.type === "TABLE_ASSIGNED") {
    toastr.info(`Table ${updated.Tnumber} assigned`);
  }

  if (payload.type === "TABLE_CLEANED") {
    toastr.success(`Table ${updated.Tnumber} is now available`);
  }
});

 socket.on("orderUpdated", (data) => {
  const currentUserId = user.id;

  // 🔥 only notify assigned waiter
  if (data.waiterId && String(data.waiterId) !== String(currentUserId)) {
    return;
  }

  if (data.type === "NEW_ORDER") {
    if (data.data.paymentType === "ONLINE") {
      toastr.success(`💳 Online Paid Order - Table ${data.data.tableNo}`);
    } else {
      toastr.info(`🍽 New Cash Order - Table ${data.data.tableNo}`);
    }
  }

  fetchTables();
});

  return () => {
    socket.off("tableUpdated");
    socket.off("orderUpdated");
  };
}, [user]);
useEffect(() => {
  socket.on("paymentInitiated", (data) => {
    if (String(data.waiterId) === String(user.id)) {
      toastr.warning(`💳 Online payment done - Table ${data.tableNo}`);
    }

    fetchTables();
  });

  return () => socket.off("paymentInitiated");
}, []);
const verifyPayment = async (orderId) => {
  await axios.put(`${API}/orders/verify-payment/${orderId}`);

  toastr.success("Payment Verified & Order Completed");
};
const fetchTables = async () => {
  const res = await axios.get(`${API}/tables/dashboard`);

  const currentUserId = localStorage.getItem("userId");


setTables(res.data);
};
const location = window.location.search;
const params = new URLSearchParams(location);

const redirectItem = params.get("redirectItem");
const category = params.get("category");

const handleTableSelect = async (table) => {
  const isMine = String(table.assignedWaiter) === String(user.id);

  // ❌ block only if other waiter already owns it
  if (table.status === "Occupied" && !isMine) {
    toastr.error("This table is handled by another waiter");
    return;
  }

  try {
    // 🔥 DIRECT ASSIGN (NO ALGORITHM)
await axios.put(`${API}/tables/assign-manual/${table.tableNo}`, {
  waiterId: user.id,
});

    localStorage.setItem("tableNo", table.tableNo);

    const params = new URLSearchParams(location.search);
    const itemId = params.get("redirectItem");
    const category = params.get("category");

    if (itemId) {
      navigate(`/MenuItems?item=${itemId}&category=${category}`);
    } else {
      navigate("/MenuItems");
    }

  } catch (err) {
    toastr.error(err.response?.data?.message || "Assignment failed");
  }
};
const getBill = (orders) => {
  let total = 0;

  orders.forEach((o) => {
    o.Order.forEach((i) => {
      total += (i.ItemID?.price || 0) * i.ItemQty;
    });
  });

  const tax = total * 0.05;
  return total + tax;
};
const handlePayment = async (orderId) => {
  await axios.put(`${API}/orders/pay/${orderId}`, {
    method: "Cash"
  });
};
const handleCleanTable = async (tableNo) => {
  await axios.put(`${API}/tables/clean/${tableNo}`);
  fetchTables();
};


  return (
    <div className="container">
      <h2>Tables</h2>

      <div className="grid-combo">
     {tables.map((t) => {
  const activeOrders = t.orders.filter(
    (o) => o.Status !== "Completed" && o.Status !== "Cancelled"
  );

  const isMine = String(t.assignedWaiter) === String(user.id);
  const isDisabled = t.status === "Occupied" && !isMine;

  return (
    <div
      key={t.tableId}
      className={`table-card 
        ${t.status === "Occupied" ? "red" : "green"} 
        ${isDisabled ? "disabled" : ""}
      `}
      onClick={() => handleTableSelect(t)}
    >
      {t.isPaid && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCleanTable(t.tableNo);
          }}
        >
          Clean Table
        </button>
      )}

      <h3>Table {t.tableNo}</h3>
      <p>{t.status}</p>

      {t.assignedWaiter && (
        <p style={{ fontSize: "12px", color: isMine ? "green" : "red" }}>
          {isMine ? "Your Table" : "Assigned to another"}
        </p>
      )}

      {activeOrders.length > 0 && (
        <div className="order-info">
          <p><b>Orders:</b> {t.totalOrders}</p>
          <p><b>Items:</b> {t.totalItems}</p>
          <p><b>Bill:</b> ₹{getBill(t.orders)}</p>

          <button
            onClick={async (e) => {
              e.stopPropagation();
              for (let order of t.orders) {
                await handlePayment(order._id);
              }
              toastr.success("Payment Done");
              fetchTables();
            }}
          >
            Pay
          </button>

       {activeOrders.map((o, index) => (
  <div key={index} className="order-box">
    
    {o.Order.map((i, idx) => (
      <div key={idx}>
        {i.ItemID?.name} x {i.ItemQty}
      </div>
    ))}

    <p>Status: {o.Status}</p>

    {/* 🔥 ADD THIS BUTTON */}
    {o.PaymentStatus !== "PAID" && (
      <button
        style={{
          background: "green",
          color: "white",
          padding: "5px 10px",
          marginTop: "5px"
        }}
        onClick={() => verifyPayment(o._id)}
      >
        Verify Payment
      </button>
    )} 

  </div>
))}
        </div>
      )}
    </div>
  );
})}
      </div>
    </div>
  );
};

export default WaiterDashboard;