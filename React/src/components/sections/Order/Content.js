import React, { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../../../socket";

const OrderPanel = ({ tableNo, onClose }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const API = process.env.REACT_APP_API_URL;

  // ✅ Calculate total
  useEffect(() => {
    let sum = 0;
    cart.forEach(item => {
      sum += item.price * item.qty;
    });
    setTotal(sum);
  }, [cart]);

  // ✅ Listen socket updates
  useEffect(() => {
    socket.on("orderUpdated", () => {
      console.log("Order Updated Live");
    });

    return () => socket.off("orderUpdated");
  }, []);

  // ✅ Add item
  const addItem = (item) => {
    const exist = cart.find(i => i._id === item._id);

    if (exist) {
      setCart(cart.map(i =>
        i._id === item._id ? { ...i, qty: i.qty + 1 } : i
      ));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  // ✅ Remove item
  const removeItem = (id) => {
    setCart(cart.filter(i => i._id !== id));
  };

  // ✅ Place order
  const placeOrder = async () => {
    try {
      const payload = {
        TableNo: tableNo,
        Order: cart.map(i => ({
          ItemID: i._id,
          ItemQty: i.qty,
          Status: "Pending"
        })),
        Status: "Confirm",
        PaymentMethod: "Pending",
        Bill: total
      };

      await axios.post(`${API}/orders/add`, payload);

      alert("Order Placed!");
      setCart([]);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="order-panel">
      <h4>Table: {tableNo}</h4>

      <div className="cart-list">
        {cart.map(item => (
          <div key={item._id} className="cart-item">
            <span>{item.name}</span>
            <span>{item.qty} x ₹{item.price}</span>

            <button onClick={() => removeItem(item._id)}>❌</button>
          </div>
        ))}
      </div>

      <h5>Total: ₹{total}</h5>

      <button className="btn btn-success" onClick={placeOrder}>
        Place Order
      </button>

      <button className="btn btn-danger" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default OrderPanel;