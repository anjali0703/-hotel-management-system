"use client";

import React, { useEffect, useState } from "react";
import { X, ShoppingBag, UtensilsCrossed } from "lucide-react";
import "./cartPanel.css";
import { socket } from "../../../socket";
import UpiQR from "./UpiQR";
import axios from "axios";
const CartPanel = ({
  show,
  tableNo,
  cartItems,
  onClose,
  onPlaceOrder,
  onUpdateQty,
  nameError,
  setNameError,
  // ✅ ADD THESE
  customerName,
  setCustomerName,
  orderNote,
  setOrderNote,
  isQROrder
}) => {
  const IMG_URL = process.env.REACT_APP_IMAGE_URL;
  const API = process.env.REACT_APP_API_URL;

  const [paymentStep, setPaymentStep] = useState("IDLE");
  // IDLE → QR → VERIFIED

  const [orderId, setOrderId] = useState(null);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
const [showOrderForm, setShowOrderForm] = useState(false);
  /* ================= SOCKET LISTENER ================= */
  useEffect(() => {
    const handlePayment = (data) => {
      if (
        data?.type === "ORDER_CONFIRMED" &&
        data?.data?._id === orderId
      ) {
        setPaymentStep("VERIFIED");

        // clear cart + close panel instantly
        onPlaceOrder("ONLINE", true);

        setTimeout(() => {
          setPaymentStep("IDLE");
          setOrderId(null);
          onClose();
        }, 800);
      }
    };

    socket.on("orderUpdated", handlePayment);

    return () => socket.off("orderUpdated", handlePayment);
  }, [orderId, onClose, onPlaceOrder]);

  /* ================= ONLINE PAYMENT ================= */
const handleOnlinePayment = async () => {
  try {
    const res = await axios.post(`${API}/orders/add`, {
      TableNo: tableNo,
      CustomerName: customerName || null,
      Note: orderNote || null,

      Status: "Pending",
      PaymentMethod: "ONLINE",
      PaymentStatus: "PENDING",

      Order: cartItems.map((i) => ({
        ItemID: i._id,
        ItemQty: i.qty,
        Status: "Pending"
      }))
    });

    // ✅ FIX: backend returns data.data
    const id = res.data.data._id;

    setOrderId(id);

    setPaymentStep("QR");

    await axios.post(`${API}/orders/initiate-payment`, {
      orderId: id
    });

  } catch (err) {
    console.error("ONLINE PAYMENT ERROR:", err);
  }
};

  if (!show) return null;

  return (
    <div className={`cart-wrapper ${show ? "active" : ""}`}>
      <div className="cart-overlay" onClick={onClose}></div>

      <div className="cart-panel">
        {/* HEADER */}
        <div className="cart-header">
          <div className="header-info">
            <span className="table-badge">Table {tableNo}</span>
            <h3 className="cart-title">Your Order</h3>
          </div>

          <button className="close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* BODY */}
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
            <>
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item-card">
                  <div className="image-content1">
                    <img
                      src={`${IMG_URL}/uploads/${item.image}`}
                      alt={item.name}
                    />
                  </div>

                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">₹{item.price}</span>
                  </div>

                  {/* qty only if not online selected */}
                  {paymentStep === "IDLE" && (
                    <div className="qty-picker">
                      <button
                        onClick={() =>
                          onUpdateQty(item._id, -1)
                        }
                        className="qty-btn"
                      >
                        −
                      </button>

                      <span className="qty-number">
                        {item.qty}
                      </span>

                      <button
                        onClick={() =>
                          onUpdateQty(item._id, 1)
                        }
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
                    {/* CUSTOMER DETAILS */}
<div className="cart-extra-fields">

  {/* NAME ONLY FOR QR USER */}
{isQROrder && (
  <>
    <input
      type="text"
      placeholder="Enter your name *"
      value={customerName}
      onChange={(e) => {
        setCustomerName(e.target.value);
        if (nameError) setNameError("");
      }}
      className={`cart-input ${nameError ? "input-error" : ""}`}
    />

    {nameError && (
      <small className="error-text">{nameError}</small>
    )}
  </>
)}
  {/* NOTE ALWAYS OPTIONAL */}
  <textarea
    placeholder="Add note for kitchen (optional)"
    value={orderNote}
    onChange={(e) => setOrderNote(e.target.value)}
    className="cart-textarea"
  />
</div></>
          )}
        </div>


        {/* FOOTER */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="summary-row">
              <span className="summary-label">
                Total Amount
              </span>
              <span className="summary-total">
                ₹{totalPrice}
              </span>
            </div>

            {/* NORMAL MODE */}
            {paymentStep === "IDLE" && (
              <>
                <button
                  className="pay-btn"
                  onClick={handleOnlinePayment}
                >
                  Pay Now (UPI)
                </button>

                <button
                  className="place-order-btn"
                  onClick={() =>
  onPlaceOrder("CASH", {
    customerName,
    orderNote
  })
}
                >
                  <ShoppingBag size={20} />
                  Confirm Order
                </button>
              </>
            )}

            {/* QR SHOWS UNTIL VERIFIED */}
            {paymentStep === "QR" && (
              <>
                <UpiQR
                  upiId="8511271374@ibl"
                  name="Hotel Management"
                  amount={totalPrice}
                  onClose={() =>
                    setPaymentStep("IDLE")
                  }
                />

                <div className="tracking-box">
                  Waiting for waiter verification...
                </div>
              </>
            )}

            {/* AFTER VERIFIED */}
            {paymentStep === "VERIFIED" && (
              <div className="tracking-box">
                ✅ Payment Confirmed
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPanel;