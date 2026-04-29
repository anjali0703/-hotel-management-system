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
  const readyOrders = [];

  tables.forEach((t) => {
    t.orders?.forEach((o) => {
      if (o.Status === "Ready") {
        readyOrders.push(o._id);
      }
    });
  });

  if (readyOrders.length > 0) {
    const audio = new Audio("/sounds/sound1.mp3");
    audio.play().catch(() => {});
  }
}, [tables]);
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
const name =
  updated.waiterName ||
  updated.assignedWaiter?.name ||
  "Unknown";
  if (payload.type === "TABLE_ASSIGNED") {
toastr.info(`Table ${updated.Tnumber} assigned to ${name}`);
  }

  if (payload.type === "TABLE_CLEANED") {
    toastr.success(`Table ${updated.Tnumber} is now available`);
  }
});

socket.on("orderUpdated", (data) => {
  const currentUserId = user.id;

  if (data.waiterId && String(data.waiterId) !== String(currentUserId)) {
    return;
  }

  // New Order Alert
  if (data.type === "NEW_ORDER") {
    if (data.data.PaymentMethod === "ONLINE") {
      toastr.success(`💳 Online Paid Order - Table ${data.data.TableNo}`);
    } else {
      toastr.info(`🍽 New Cash Order - Table ${data.data.TableNo}`);
    }
  }

  // 🔔 READY SOUND ALERT
  if (
    data.type === "STATUS_CHANGED" &&
    data.data.Status === "Ready"
  ) {
    toastr.success("🍽 Order Ready!");
    
    new Audio("/sounds/sound1.mp3")
      .play()
      .catch(() => {});
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
      toastr.warning(`💳 Online payment done - Table ${data.Tnumber}`);
    }

    fetchTables();
  });

  return () => socket.off("paymentInitiated");
}, []);
const verifyPayment = async (orderId) => {
  await axios.put(`${API}/orders/verify-payment/${orderId}`);

  toastr.success("Online Payment Verified");
};
const markServed = async (orderId) => {
  await axios.put(`${API}/orders/served/${orderId}`);
  toastr.success("Order Completed");
  fetchTables();
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
 const isMine =
  String(table.assignedWaiter?._id || table.assignedWaiter) === String(user.id);

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

const handleToggleStatus = async (table) => {
  try {
    const newStatus =
      table.status === "Occupied" ? "Available" : "Occupied";

    await axios.put(`${API}/tables/save`, {
      id: table.tableId,
      Tnumber: table.tableNo,
      capacity: table.Capacity,
      status: newStatus,
      active: true,
      userId: user.id,
    });

    toastr.success(`Table marked as ${newStatus}`);

    fetchTables(); // refresh UI
  } catch (err) {
    toastr.error("Failed to update table status");
  }
};

  return (
    <div className="container">
      <h3>Welcome !<span className="text-success pl-2">{user.name}</span></h3>

      <div className="grid-combo">
     {tables.map((t) => {
  const activeOrders = t.orders.filter(
    (o) => o.Status !== "Completed" && o.Status !== "Cancelled"
  );

const isMine =
  String(t.assignedWaiter?._id || t.assignedWaiter) === String(user.id);
  const isDisabled = t.status === "Occupied" && !isMine;

  return (
    <div
  key={t.tableId}
  className={`table-card ${t.status === "Occupied" ? "occupied-card" : "available-card"} ${isDisabled ? "disabled" : ""}`}
  onClick={() => handleTableSelect(t)}
>
  <div className="table-top">
    
    <div>
    
      <h6 className="mb-1">Table No : {t.tableNo}</h6>
      <p className="mb-1">Capacity : {t.Capacity}</p>
          {t.assignedWaiter && (
        <p style={{ fontSize: "12px",marginBottom:10, color: isMine ? "green" : "red" }}>
          {isMine ? "Your Table" : "Assigned to "}: {t.waiterName}
        </p>
      )}
    </div>

   <span
  className={`status-badge ${
    t.status === "Occupied" ? "busy" : "free"
  }`}
  style={{ cursor: "pointer" }}
>
  {t.status}
</span>
  </div>
 

  {activeOrders.length > 0 && isMine && (
    <div className="table-body">

      {activeOrders.slice(0, 3).map((o, i) => (
      
 <div key={i} className="d-flex justify-content-between align-items-center">
    <div>
          <div >
          {o.Order.map((it, x) => (
            <div key={x}>
              {it.ItemID?.name}   x{it.ItemQty}
            </div>
          ))}
              <p>Status: {o.Status}</p>
          </div>
             <div className="btn-row">

     {activeOrders.some(
  (o) => o.PaymentMethod === "CASH" && o.PaymentStatus !== "PAID"
) && (
  <button
    onClick={(e) => {
      e.stopPropagation();

      const order = activeOrders.find(
        (o) => o.PaymentMethod === "CASH" && o.PaymentStatus !== "PAID"
      );

      if (order) handlePayment(order._id);
    }}
  >
    Cash
  </button>
)}

      {activeOrders.some(
  (o) =>
    o.PaymentMethod === "ONLINE" &&
    o.PaymentStatus === "PENDING"
) && (
  <button
    onClick={(e) => {
      e.stopPropagation();

      const order = activeOrders.find(
        (o) =>
          o.PaymentMethod === "ONLINE" &&
          o.PaymentStatus === "PENDING"
      );

      if (order) verifyPayment(order._id);
    }}
  >
    Verify
  </button>
)}

        {activeOrders.some((o)=>o.Status==="Ready") && (
          <button onClick={(e)=>{e.stopPropagation();markServed(activeOrders[0]._id)}}>Served</button>
        )}

      </div>
               
    
        </div>
          <p>
      Payment:
      <b style={{ color: o.PaymentStatus === "PAID" ? "green" : "red" }}>
        {o.PaymentStatus}
      </b> 
    </p>
        </div>
        
      ))}

      {/* {activeOrders.some((o) => o.Status === "Ready") && (
        <div className="ready-pill">🍽 Ready</div>
      )} */}

      {/* <div className="btn-row">

     {activeOrders.some(
  (o) => o.PaymentMethod === "CASH" && o.PaymentStatus !== "PAID"
) && (
  <button
    onClick={(e) => {
      e.stopPropagation();

      const order = activeOrders.find(
        (o) => o.PaymentMethod === "CASH" && o.PaymentStatus !== "PAID"
      );

      if (order) handlePayment(order._id);
    }}
  >
    Cash
  </button>
)}

      {activeOrders.some(
  (o) =>
    o.PaymentMethod === "ONLINE" &&
    o.PaymentStatus === "PENDING"
) && (
  <button
    onClick={(e) => {
      e.stopPropagation();

      const order = activeOrders.find(
        (o) =>
          o.PaymentMethod === "ONLINE" &&
          o.PaymentStatus === "PENDING"
      );

      if (order) verifyPayment(order._id);
    }}
  >
    Verify
  </button>
)}

        {activeOrders.some((o)=>o.Status==="Ready") && (
          <button onClick={(e)=>{e.stopPropagation();markServed(activeOrders[0]._id)}}>Served</button>
        )}

      </div> */}
    </div>
  )}

  {t.status === "Occupied" &&
   activeOrders.length === 0 &&
   t.orders.every((x)=>x.PaymentStatus==="PAID") && (
    <button
      className="clean-btn"
      onClick={(e)=>{
        e.stopPropagation();
        handleCleanTable(t.tableNo);
      }}
    >
      🧹 Clean Table
    </button>
  )}
</div>
  );
})}
      </div>
    </div>
  );
};

export default WaiterDashboard;