import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {socket} from "../../../socket"; // adjust path
import "./kitchen.css";

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);
  const API = process.env.REACT_APP_API_URL;

  // 🔊 ONE audio instance (best practice)
  const audioRef = useRef(null);

  // ================= INIT AUDIO =================
  useEffect(() => {
    audioRef.current = new Audio("/sounds/sound1.mp3");
    audioRef.current.volume = 0.3; // 🔥 soft volume
  }, []);

  // ================= PLAY SOUND =================
  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // restart sound
      audioRef.current.play().catch(() => {});
    }
  };
const getOrderTotal = (order) => {
  return order.Order?.reduce((sum, item) => {
    const price = item.ItemID?.price || item.price || 0;
    return sum + price * item.ItemQty;
  }, 0);
};
  // ================= FETCH =================
  const fetchOrders = async () => {
    const res = await axios.get(`${API}/orders`);
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();

    socket.on("orderUpdated", (data) => {
      console.log("Kitchen Update:", data);

      fetchOrders();

      // 🔔 only for new order
      if (data.type === "NEW_ORDER") {
        playSound(); // ✅ use function
      }
    });

    return () => socket.off("orderUpdated");
  }, []);


  // ================= UPDATE STATUS =================
  const updateStatus = async (id, status) => {
    await axios.put(`${API}/orders/status/${id}`, { status });
  };

return (
  <div className="kitchen">
    <h2>🍳 Kitchen Dashboard</h2>

    <div className="kitchen-grid">
      {orders.map((order) => (
        <div
          key={order._id}
          className={`order-card ${
            order.Status === "Ready" ? "red" : "green"
          }`}
        >
          {/* HEADER */}
          <h3>Table {order.TableNo}</h3>

          <p>
            Status: <b>{order.Status}</b>
          </p>

          {/* ORDER BY */}
          <p>
            Order By:{" "}
            <b>
              {order.OrderBy?.name ||
                order.OrderBy ||
                "Unknown"}
            </b>
          </p>

          {/* ITEMS */}
          <div className="items">
            {order.Order?.map((item, i) => (
              <div key={i}>
                🍽️{" "}
                {item.ItemID?.name ||
                  item.ItemName ||
                  "Item"}{" "}
                x {item.ItemQty} = ₹
                {(
                  (item.ItemID?.price || 0) *
                  item.ItemQty
                ).toFixed(2)}
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="total-box">
            💰 Total:{" "}
            <b>₹{getOrderTotal(order).toFixed(2)}</b>
          </div>

          {/* ACTIONS */}
          <div className="actions">
            {order.Status === "CONFIRMED" && (
              <button
                className="btn preparing"
                onClick={() =>
                  updateStatus(order._id, "Preparing")
                }
              >
                Preparing
              </button>
            )}

            {order.Status === "Preparing" && (
              <button
                className="btn ready"
                onClick={() =>
                  updateStatus(order._id, "Ready")
                }
              >
                Ready
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

export default KitchenDashboard;