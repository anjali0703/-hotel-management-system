import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { X } from "lucide-react";

const UpiQR = ({ upiId, name, amount, onClose }) => {
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;

  return (
    <div style={{ textAlign: "center", position: "relative" }}>

      {/* ❌ CLOSE BUTTON */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          background: "transparent",
          border: "none",
          cursor: "pointer"
        }}
      >
        <X size={22} />
      </button>

      <h3>Scan to Pay</h3>

      <QRCodeCanvas value={upiUrl} size={220} />

      <p>Amount: ₹{amount}</p>
    </div>
  );
};

export default UpiQR;