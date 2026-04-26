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
          <div   className={`order-card ${order.
Status === "Ready" ? "red" : "green"}`} key={order._id}>
            <h3>Table {order.TableNo}</h3>
            <p>Status: <b>{order.Status}</b></p>

            <div className="items">
              {order.Order.map((item, i) => (
                <div key={i}>
                  {item.ItemName || item.ItemID} x {item.ItemQty}
                </div>
              ))}
            </div>

            <div className="actions">
              {order.Status === "CONFIRMED" && (
                <button
                  className="btn preparing"
                  onClick={() => updateStatus(order._id, "Preparing")}
                >
                  Preparing
                </button>
              )}

              {order.Status === "Preparing" && (
                <button
                  className="btn ready"
                  onClick={() => updateStatus(order._id, "Ready")}
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