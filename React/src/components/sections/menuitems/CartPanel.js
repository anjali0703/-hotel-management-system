"use client";

import React from "react";
import { X, ShoppingBag, UtensilsCrossed } from "lucide-react"; 
import "./cartPanel.css";
import { useEffect } from "react";
import { socket } from "../../../socket";
import UpiQR from "./UpiQR";
import { useState } from "react";
import axios from "axios";
const CartPanel = ({ show, tableNo, cartItems, onClose, onPlaceOrder, onUpdateQty }) => {
      const IMG_URL = process.env.REACT_APP_IMAGE_URL;
      const [showQR, setShowQR] = useState(false);
      const [paymentStep, setPaymentStep] = useState("IDLE");
// IDLE → QR → WAITING → VERIFIED

const [orderId, setOrderId] = useState(null);
  const API = process.env.REACT_APP_API_URL;
  // Calculate total for the "Attractive" footer
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
useEffect(() => {
  socket.on("orderUpdated", (data) => {
    if (data.type === "PAYMENT_CONFIRMED") {
      if (data.data._id === orderId) {
        setPaymentStep("VERIFIED");

        setTimeout(() => {
          onClose(); // close panel automatically
        }, 1500);
      }
    }
  });

  return () => socket.off("orderUpdated");
}, [orderId]);
const handleOnlinePayment = async () => {
  try {
    const res = await axios.post(`${API}/orders/add`, {
      TableNo: tableNo,
      Order: cartItems.map(i => ({
        ItemID: i._id,
        ItemQty: i.qty
      })),
      Status: "Pending",
      PaymentMethod: "ONLINE",
      PaymentStatus: "PENDING"
    });

    const id = res.data._id;
    setOrderId(id);

    setPaymentStep("QR"); // show QR first

    await axios.post(`${API}/orders/initiate-payment`, {
      orderId: id
    });

    setPaymentStep("WAITING"); // waiting for verification
  } catch (err) {
    console.error(err);
  }
};
  if (!show) return null;

  return (
    <div className={`cart-wrapper ${show ? "active" : ""}`}>
      {/* Background Blur Overlay */}
      <div className="cart-overlay" onClick={onClose}></div>

      {/* Side Slide Panel */}
      <div className="cart-panel">
        
        <div className="cart-header">
          <div className="header-info">
            <span className="table-badge">Table {tableNo}</span>
            <h3 className="cart-title">Your Order</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-state">
              <div className="icon-circle">
                <UtensilsCrossed size={32} />
              </div>
              <p>Your tray is empty</p>
              <span>Select items from the menu to begin</span>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item-card">
                         <div className="image-content1" style={{ position: "relative" }}>
  <img src={`${IMG_URL}/uploads/${item.image}`} alt={item.name} /></div>
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">₹{item.price}</span>
                  </div>
                  
                  <div className="qty-picker">
                    <button onClick={() => onUpdateQty(item._id, -1)} className="qty-btn">−</button>
                    <span className="qty-number">{item.qty}</span>
                    <button onClick={() => onUpdateQty(item._id, 1)} className="qty-btn">+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      {cartItems.length > 0 && (
  <div className="cart-footer">

    <div className="summary-row">
      <span className="summary-label">Total Amount</span>
      <span className="summary-total">₹{totalPrice}</span>
    </div>
   {showQR && (
  <UpiQR
    upiId="8511271374@ibl"   // 🔥 your UPI ID her
    name="Hotel Management"
amount={totalPrice}
    onClose={() => setShowQR(false)}
  />
)}
   {paymentStep === "IDLE" && (
  <button onClick={handleOnlinePayment}>
    Pay Now (UPI)
  </button>
)}

{paymentStep === "QR" && (
  <UpiQR
    upiId="8511271374@ibl"
    name="Hotel Management"
    amount={totalPrice}
    onClose={() => setPaymentStep("IDLE")}
  />
)}

{paymentStep === "WAITING" && (
  <div className="tracking-box">
    ⏳ Payment initiated... waiting for verification
    <p>Track your order in real-time</p>
  </div>
)}

{paymentStep === "VERIFIED" && (
  <button
    className="confirm-btn"
    onClick={() => onPlaceOrder("ONLINE")}
  >
    ✅ Confirm Order
  </button>
  
)}
 <button className="place-order-btn" onClick={onPlaceOrder}>
              <ShoppingBag size={20} />
              Confirm Order
            </button>
  </div>
)}
      </div>
   
    </div>
  );
};

export default CartPanel;