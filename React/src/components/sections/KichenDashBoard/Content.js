import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {socket} from "../../../socket"; // adjust path
import "./kitchen.css";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../../contexts/AuthContext";
const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);
  const API = process.env.REACT_APP_API_URL;

  // 🔊 ONE audio instance (best practice)
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
const handleLogout = () => {
  logout();
  navigate("/login");
};

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
 const handlePrintBill = (order) => {
  const printWindow = window.open("", "_blank");

  // =========================
  // Calculate Total Amount
  // =========================
  let grandTotal = 0;

  const itemsHtml = order.Order.map((item, index) => {
    const name = item.ItemID?.name || item.ItemName || "Item";
    const qty = Number(item.ItemQty || 0);
    const price = Number(item.ItemID?.price || item.Price || 0);
    const total = qty * price;

    grandTotal += total;

    return `
      <tr>
        <td style="padding:4px 0;">${index + 1}</td>
        <td style="padding:4px 0;">${name}</td>
        <td style="padding:4px 0; text-align:right;">${qty}</td>
        <td style="padding:4px 0; text-align:right;">₹${price}</td>
        <td style="padding:4px 0; text-align:right;">₹${total}</td>
      </tr>
    `;
  }).join("");

  // =========================
  // Proper Date & Time
  // =========================
  const date = new Date(order.createdDateTime);

  const dateStr = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const timeStr = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  printWindow.document.write(`
    <html>
      <head>
        <title>Print Bill</title>
        <style>
          body {
            font-family: Courier, monospace;
            width: 80mm;
            margin: 0 auto;
            padding: 10px;
            color: #000;
            font-size: 12px;
          }

          .center { text-align: center; }

          .dashed {
            border-top: 1px dashed #000;
            margin: 6px 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }

          th, td {
            padding: 3px 0;
          }

          .right {
            text-align: right;
          }

          .bold {
            font-weight: bold;
          }

          .footer {
            font-size: 10px;
            margin-top: 10px;
            text-align: center;
          }
        </style>
      </head>

      <body>

        <div class="center">
          <h3 style="margin:0;">Food Order System</h3>
          <h4 style="margin:2px 0;">Bite Bliss</h4>

          <div class="dashed"></div>

          <strong>Table No: ${order.TableNo}</strong><br>

          Order By: ${
            order.CustomerName
              ? order.CustomerName
              : order.OrderBy?.name || "Waiter"
          }<br>

          Date: ${dateStr}<br>
          Time: ${timeStr}

          <div class="dashed"></div>
        </div>

        <table>
          <thead>
            <tr>
              <th align="left">No</th>
              <th align="left">Item</th>
              <th align="right">Qty</th>
              <th align="right">Rate</th>
              <th align="right">Amt</th>
            </tr>
          </thead>

          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="dashed"></div>

        <table>
          <tr>
            <td class="bold">Grand Total</td>
            <td class="right bold">₹${grandTotal}</td>
          </tr>
        </table>

        ${
          order.Note
            ? `<div class="dashed"></div>
               <p><strong>Note:</strong> ${order.Note}</p>`
            : ""
        }

        <div class="dashed"></div>

        <div class="footer">
          Thank You Visit Again ❤️
        </div>

      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();

  printWindow.onafterprint = () => {
    printWindow.close();
  };
};

return (
  <div className="kitchen">
  <div className="kitchen-header">
      <h3 className="mb-0">🍳 Kitchen Dashboard</h3>

      <button
        className="logout-btn"
        onClick={handleLogout}
        title="Logout"
      >
        <FaSignOutAlt />
      </button>
    </div>
<div className="app-con">
    <div className="kitchen-grid">
      {orders.map((order) => (
        <div
          key={order._id}
          className={`order-card ${
            order.Status === "Ready" ? "red" : "green"
          }`}
        >
        <div className="d-flex justify-content-between align-items-center mb-1">
  {/* TABLE NO ON LEFT */}
  <h6 className="mb-0 fw-bold">Table No: {order.TableNo}</h6>

  {/* BILL BUTTON ON RIGHT */}
  <button
    className="btn-bill-chip"
    onClick={() => handlePrintBill(order)}
  >
    <i className="fa fa-print"></i> Bill
  </button>
</div>
 {/* ITEMS */}<div className="d-flex " >
          <div className="items ">
            {order.Order?.map((item, i) => (
              <div className="text-success " key={i}>
                🍽️{" "}
                {item.ItemID?.name ||
                  item.ItemName ||
                  "Item"}{" "}
                x{item.ItemQty} 
               
              </div>
            ))}
             <div className="total-box mt-1">
            💰 Total:{" "}
            <b>₹{getOrderTotal(order).toFixed(2)}</b>
          </div>
          </div>
          
          <p className="mt-2 ml-5">
            Status: <b>{order.Status}</b>
             {/* ORDER BY */}
          <p className="mt-1 mb-0">
            Order By:{" "}
           <span className="text">
              {order.CustomerName||order.OrderBy?.name ||
                order.OrderBy ||
                "Unknown"}
           </span>
        </p>
          </p>
</div>
        
          {/* ACTIONS */}
          <div>
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
  </div>
);
};

export default KitchenDashboard;