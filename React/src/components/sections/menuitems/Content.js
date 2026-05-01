import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Search, Plus } from "lucide-react";

import {
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import MenuModal from "./MenuModel";
import "./menuItems.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useLocation } from "react-router-dom";
import "react-data-table-component-extensions/dist/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../assets/css/toastr.min.css"
import "../../../App.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import {socket }from "../../../socket";
import CartPanel from "./CartPanel";

const MenuItems = () => {
  const location = useLocation();

const navigate = useNavigate();
const queryParams = new URLSearchParams(location.search);
const tableNo = queryParams.get("table") || localStorage.getItem("tableNo");
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState("All");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  // ... add this state near your other states
  const [orderNote, setOrderNote] = useState("");
const [customerName, setCustomerName] = useState("");
const [activeOrders, setActiveOrders] = useState([]);
const [cart, setCart] = useState(() => {
  const saved = localStorage.getItem("tableCart");
  return saved ? JSON.parse(saved) : {};
});
  const [showCart, setShowCart] = useState(false);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const isQROrder = queryParams.get("table") ? true : false;
const [billData, setBillData] = useState(null);
  const API = process.env.REACT_APP_API_URL;
  const IMG_URL = process.env.REACT_APP_IMAGE_URL;
    const { user } = useAuth();
    const [nameError, setNameError] = useState("");
  const currentCart = cart[tableNo] || [];
    const roleId = user?.userTypeId;
  
const isAdmin = roleId === process.env.REACT_APP_ROLE_ADMIN;
const isWaiter = roleId === process.env.REACT_APP_ROLE_WAITER;
const isKitchen = roleId === process.env.REACT_APP_ROLE_KITCHEN;

useEffect(() => {
  socket.on("orderUpdated", () => {
    console.log("Live update received");
  });

  return () => socket.off("orderUpdated");
}, []);
// QR = no login
const isQR = !user;
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const urlTable = params.get("table");

  if (urlTable) {
    localStorage.setItem("tableNo", urlTable);
  }
}, [location.search]);
  useEffect(() => {
    fetchData();
  }, [selectedCat, search]);

  useEffect(() => {
    fetchCategories();
  }, []);
useEffect(() => {
  localStorage.setItem("tableCart", JSON.stringify(cart));
}, [cart]);
  useEffect(() => {
  const params = new URLSearchParams(location.search);

  const itemId = params.get("item");
  const category = params.get("category");

  if (category) {
    setSelectedCat(category);
  }

  if (itemId) {
    // auto open cart with item
    const found = items.find((i) => i._id === itemId);
    if (found) {
      handleAddToOrder(found);
    }
  }
}, [items]);

useEffect(() => {
  const fetchActiveOrders = async () => {
    if (!tableNo) return;
    try {
      const res = await axios.get(`${API}/orders/table/${tableNo}`);
      // Filter for orders that aren't "Completed" or "Cancelled"
      const live = res.data.filter(o => o.Status !== "Completed" && o.Status !== "Cancelled");
      setActiveOrders(live);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  fetchActiveOrders();

  socket.on("orderUpdated", () => {
    fetchActiveOrders(); // Re-fetch when kitchen updates status
  });

  return () => socket.off("orderUpdated");
}, [tableNo, API]);
useEffect(() => {
  const track = trackRef.current;
  if (!track) return;

  let position = 0;
  let velocity = 0;
  let isDragging = false;
  let isPaused = false;

  let animationFrame;

  const speed = 0.3;

  const getWidth = () => track.scrollWidth / 2;

const itemWidth = () =>
  track.firstElementChild.offsetWidth + 20; // width + gap

const animate = () => {
  if (!isDragging && !isPaused) {
    position += speed + velocity;
    velocity *= 0.95;

    // 🔥 when one item fully passed
    if (position >= itemWidth()) {
      position -= itemWidth();

      // move first item to end
      track.appendChild(track.firstElementChild);
    }

    if (position < 0) {
      position += itemWidth();

      // move last item to front
      track.prepend(track.lastElementChild);
    }

    track.style.transform = `translateX(-${position}px)`;
  }

  animationFrame = requestAnimationFrame(animate);
};

  // 🔥 DRAG
  let startX = 0;
  let lastX = 0;

  const startDrag = (x) => {
    isDragging = true;
    startX = x;
    lastX = x;
    velocity = 0;
  };

  const onDrag = (x) => {
    if (!isDragging) return;

    const dx = x - lastX;
    position -= dx;
    velocity = dx * 0.2;

    const max = getWidth();
    if (position >= max) position -= max;
    if (position < 0) position += max;

    track.style.transform = `translateX(-${position}px)`;

    lastX = x;
  };

  const endDrag = () => {
    isDragging = false;
  };

  // 🖱️ MOUSE
  track.addEventListener("mousedown", (e) => startDrag(e.clientX));
  window.addEventListener("mousemove", (e) => onDrag(e.clientX));
  window.addEventListener("mouseup", endDrag);

  // 📱 TOUCH
  track.addEventListener("touchstart", (e) =>
    startDrag(e.touches[0].clientX)
  );
  track.addEventListener("touchmove", (e) =>
    onDrag(e.touches[0].clientX)
  );
  track.addEventListener("touchend", endDrag);

  // 🔥 PAUSE / RESUME (THIS IS WHAT YOU WANT)
  track.addEventListener("mouseenter", () => {
    isPaused = true;   // STOP exactly where it is
  });

  track.addEventListener("mouseleave", () => {
    isPaused = false;  // CONTINUE from same position
  });

  animate();

  return () => cancelAnimationFrame(animationFrame);
}, [categories]);
  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}/menu-items`, {
        params: { category: selectedCat, search }
      });
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };


  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/menuCategory`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API}/menuItems/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

const handleAddToOrder = (item) => {
  const tableNo = localStorage.getItem("tableNo");

  if (!tableNo) {
    navigate(`/waiter-dashboard?redirectItem=${item._id}&category=${item.menucategoryId?._id}`);
    return;
  }

  setCart((prev) => {
    const tableCart = prev[tableNo] || [];

    const existing = tableCart.find((i) => i._id === item._id);

    let updated;
    if (existing) {
      updated = tableCart.map((i) =>
        i._id === item._id ? { ...i, qty: i.qty + 1 } : i
      );
    } else {
      updated = [...tableCart, { ...item, qty: 1 }];
    }

    return { ...prev, [tableNo]: updated };
  });

  setShowCart(true);
};
const placeOrder = async (paymentMethod = "CASH") => {
  const tableCart = cart[tableNo];

  if (!tableCart || tableCart.length === 0) {
    alert("Cart empty");
    return;
  }

 // ❗ VALIDATION FOR QR USER NAME
if (isQROrder && !customerName.trim()) {
  setNameError("Please enter your name");
  return;
}


const orderData = {
  TableNo: tableNo,
  CustomerName: isQROrder ? customerName : null,
  Note: orderNote || null,

  Status: "CONFIRMED",
  PaymentMethod: paymentMethod,

  Order: tableCart.map((item) => ({
    ItemID: item._id,
    ItemQty: item.qty,
    Status: "CONFIRMED"
  }))
};

  await axios.post(`${API}/orders/add`, orderData);

  // clear cart
  setCart((prev) => {
    const updated = { ...prev };
    delete updated[tableNo];
    return updated;
  });

  setShowCart(false);
};
const getOrderTotal = (order) => {
  if (!order?.Order || !items?.length) return 0;

  return order.Order.reduce((sum, row) => {
    // ✅ your real Mongo format
    const itemId = row?.ItemID?.$oid;

    // find matching menu item
    const menuItem = items.find(
      (m) => String(m._id) === String(itemId)
    );

    const qty = Number(row?.ItemQty || 0);
    const price = Number(menuItem?.price || 0);

    return sum + qty * price;
  }, 0);
};
const handleUpdateQty = (productId, change) => {
  const tableNo = localStorage.getItem("tableNo");

  setCart((prev) => {
    const tableCart = prev[tableNo] || [];

    const updatedCart = tableCart
      .map((item) =>
        item._id === productId
          ? { ...item, qty: item.qty + change }
          : item
      )
      .filter((item) => item.qty > 0); // remove if qty = 0

    return {
      ...prev,
      [tableNo]: updatedCart
    };
  });
};
const trackRef = useRef(null);


const fullList = [
  { _id: "all", name: "All", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=400" },
  ...categories
]; 

const generateInvoice = async () => {
  try {
    const res = await axios.get(`${API}/orders/invoice/${tableNo}`);
    
    const pdfUrl = res.data.pdf;

    window.open(pdfUrl, "_blank");

  } catch (err) {
    console.error(err);
  }
};

const previewBill = async () => {
  try {
    const res = await axios.get(`${API}/orders/invoice/${tableNo}`);
    setBillData(res.data);
    setShowBillPreview(true);
  } catch (err) {
    console.error(err);
  }
};
return (
    <>
  <div className="app">
       <header className="header">
        {!isQR&&(
            <h3 style={{ textAlign: 'left' }}>
              <b>Menu Items</b>
            </h3>)}
            {isQR && (
        <div className="promo-section">
          <div className="promo-content">
            <h1 className="promo-title">
              Hungry? <span>Order Fresh.</span>
            </h1>
            <p className="promo-subtitle">Delicious meals from our kitchen to your table.</p>
          </div>
        <div className="infinite-slider">
 <div className="infinite-slider">
  <div className="slider-track" ref={trackRef}>
    {[...fullList, ...fullList].map((cat, index) => (
      <div
        className="slide-item"
        key={index}
        onClick={() => setSelectedCat(cat._id === "all" ? "All" : cat._id)}
      >
        <img
          src={
            cat.image.startsWith("http")
              ? cat.image
              : `${IMG_URL}${cat.image}`
          }
          alt={cat.name}
        />
        <span className="slide-label">{cat.name}</span>
      </div>
    ))}
  </div>
</div>
    </div>
  </div>
)}
         
            <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%"}}>
              <div className="search-bar" style={{ flex: "1", position: "relative" }}>
                <i className="fa fa-fw fa-lg fa-search search-icon"></i>
                <input
                    type="text"
                   placeholder={isAdmin ? "Search..." : "What would you like to eat today ?"}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
              </div>
               {isAdmin && ( 
              <div className="search-bar" style={{ flexShrink: "0" }}>
                 <button className="add-btn" onClick={() => openModal()}>
                <i
                     className="bi bi-plus-lg h5"
                    style={{ cursor: "pointer", color: "#DA6317",background:"none" }}
                 ></i>
                </button>
        
              </div>
               )}
               {(!isAdmin&& !isKitchen) &&  ( 
              <div className="search-bar" style={{ flexShrink: "0" }}>
                 <button className="add-btn" onClick={() =>setShowCart(true)}>
                  <i class="fas fa-sliders-h h5" style={{ cursor: "pointer", color: "#DA6317",background:"none" }}></i>
              
                </button>
        
              </div>
               )}
            </div> 

          </header>
    <div className="pill-container">
      <button
        className={`pill ${selectedCat === "All" ? "active" : ""}`}
        onClick={() => setSelectedCat("All")}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id}
          className={`pill ${selectedCat === cat._id ? "active" : ""}`}
          onClick={() => setSelectedCat(cat._id)}
        >
          <img src={`${IMG_URL}${cat.image}`} alt="" />
          {cat.name}
        </button>
      ))}
    </div>

    <div className="items-grid">
      {items.map((item) => (
        <div className="card1" key={item._id} >
          <div className="card1-content">
            <h4>{item.name}</h4>
            <p>₹{item.price || 0}</p>
           
             <span>{item.description}</span>
              <span>{item.menucategoryId?.name}</span>
                  {isAdmin && ( 
            <div className="actions1">
              <FaEdit onClick={() => openModal(item)} />
              <FaTrash onClick={() => deleteItem(item._id)} />
            </div>)}
          </div>

      <div className="image-content" style={{ position: "relative" }}>
  <img src={`${IMG_URL}/uploads/${item.image}`} alt={item.name} />

  {/* SHOW ONLY FOR WAITER + QR */}
  {(isWaiter || isQR) && (
    <button
      className="add-to-cart-btn"
      onClick={() => handleAddToOrder(item)}
    >
      + Add
    </button>
  )}
</div>
        </div>
      ))}
    </div>
     </div>

      {isAdmin && ( 
      <MenuModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      item={editingItem}
      categories={categories}
      refresh={fetchData}
    />)}
    {/* LIVE ORDER TRACKER */}
{activeOrders.length > 0 && (
  <div className="live-tracker-container">
    <div className="tracker-card">
      <div className="tracker-header">
        <div className="live-dot"></div>
        <span>Live Order Status - Table {tableNo}</span>
      </div>
      
      {activeOrders.map((order, idx) => (
        <div key={idx} className="order-status-row">
          <div className="status-info">
            <div className="d-flex justify-content-between">
            <p className="order-id">Order #{order._id.slice(-4)}</p>
            {/* <p className="mr-0">Total: ₹{getOrderTotal(order)}</p> */}
            </div>
            <div className="status-stepper">
              <div className={`step ${order.Status === 'Pending' ? 'active' : 'done'}`}>
                <div className="step-circle"></div>
                <span>Recived</span>
              </div>
                <div className={`step ${order.Status === 'CONFIRMED' ? 'active' : 'done'}`}>
                <div className="step-circle"></div>
                <span>Confirmed</span>
              </div>
              <div className={`step ${order.Status === 'Preparing' ? 'active' : 'done'}`}>
                <div className="step-circle"></div>
                <span>Cooking</span>
              </div>
              <div className={`step ${order.Status === 'Ready' ? 'active' : ''}`}>
                <div className="step-circle"></div>
                <span>Ready</span>
              </div>
            </div>
          </div>
       
        </div>
      ))}
      {activeOrders.some(o =>( o.Status === "CONFIRMED"&& o.Status === 'Ready' && o.Status === 'Preparing' )) && (
  <div className="bill-actions">
    <button onClick={previewBill}>Preview Bill</button>
    <button onClick={generateInvoice}>Download Bill</button>
  </div>
)}

    </div>
  </div> 
)}{showBillPreview && billData && (
  <div className="bill-modal">
    <div className="bill-card">

      <h2>Invoice Preview</h2>

      <p>Table No: {billData.tableNo}</p>
      <p>Waiter: {billData.waiter}</p>
      <p>Date: {billData.date}</p>

      <hr />

      {billData.orders.map((order, i) => (
        <div key={i}>
          <h4>Order #{order.orderId}</h4>

          {order.items.map((item, idx) => (
            <p key={idx}>
              {item.name} x {item.qty} = ₹{item.total}
            </p>
          ))}

          <b>Total ₹{order.total}</b>
          <hr />
        </div>
      ))}

      <h3>Grand Total ₹{getOrderTotal}</h3>

      <img src={billData.qr} width="130" />

      <div style={{marginTop:"15px"}}>
        <button onClick={generateInvoice}>Download</button>
        <button onClick={() => setShowBillPreview(false)}>Close</button>
      </div>

    </div>
  </div>
)}
    <CartPanel
  show={(isWaiter || isQR) && showCart}
  tableNo={tableNo}
  cartItems={currentCart}
  onClose={() => setShowCart(false)}
  onPlaceOrder={placeOrder}
  onUpdateQty={handleUpdateQty} 
  customerName={customerName}
  setCustomerName={setCustomerName}
  orderNote={orderNote}
  setOrderNote={setOrderNote}
  isQROrder={isQROrder}
    nameError={nameError}          // ✅ ADD THIS
  setNameError={setNameError}   
/>
  </>
);
};

export default MenuItems;