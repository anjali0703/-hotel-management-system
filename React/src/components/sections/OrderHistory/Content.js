import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import io from "socket.io-client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import "react-data-table-component-extensions/dist/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../assets/css/toastr.min.css"
import "../../../App.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-blue/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // Core CSS
import "primeicons/primeicons.css";

const socket = io(process.env.REACT_APP_API_URL);

const Content = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    getOrders();
    socket.on("orderUpdated", (msg) => {
      setOrders((prev) =>
        prev.map((item) => (item._id === msg.data._id ? msg.data : item))
      );
      if (selectedOrder?._id === msg.data._id) {
        setSelectedOrder(msg.data);
      }
    });
    return () => socket.off("orderUpdated");
  }, [selectedOrder]);
const formatDateTime = (dateValue) => {
  const date = new Date(dateValue);

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear().toString().slice(-2);

  const hour = date.getHours();
  const minute = date.getMinutes().toString().padStart(2, "0");

return `${day}${month}-${year}, ${hour}:${minute}`;};
  const getOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/orders/all`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openDetails = async (id) => {
    try {
      const res = await axios.get(`${apiUrl}/orders/details/${id}`);
      setSelectedOrder(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching details", err);
    }
  };

  // PDF Generation Logic
const generatePDF = (order) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  const total = order.Order.reduce(
    (sum, item) => sum + (item.ItemID?.price || 0) * item.ItemQty,
    0
  );

  /* ================= 1. BRAND HEADER ================= */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text("ORDER INVOICE", pageWidth / 2, 20, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(`ID: ${order._id?.toUpperCase()}`, pageWidth / 2, 25, { align: "center" });

  // Divider
  doc.setDrawColor(220);
  doc.line(pageWidth / 2 - 15, 29, pageWidth / 2 - 5, 29);
  doc.line(pageWidth / 2 + 5, 29, pageWidth / 2 + 15, 29);
  doc.text("*", pageWidth / 2, 30, { align: "center" });

  /* ================= 2. METADATA SECTION ================= */
  let y = 45;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text("TABLE NUMBER", 20, y);
  doc.text("DATE & TIME", pageWidth - 20, y, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text(`${order.TableNo}`, 20, y + 6);
  
const dateStr = formatDateTime(order.createdDateTime);
  doc.text(dateStr, pageWidth - 20, y + 6, { align: "right" });

  y += 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text("ORDER BY", 20, y);
  doc.text("PAYMENT MODE", pageWidth - 20, y, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`${order.OrderBy?.name || "Guest"}`, 20, y + 6);
  doc.text(`${order.PaymentMethod?.toUpperCase()}`, pageWidth - 20, y + 6, { align: "right" });

  /* ================= 3. THE TABLE WITH COLORED HEADER ================= */
  const tableHead = [["Menu Item", "Price", "Qty", "Total"]];
  const tableBody = order.Order.map((item) => [
    item.ItemID?.name,
    `Rs. ${item.ItemID?.price || 0}`,
    `x${item.ItemQty}`,
    `Rs. ${(item.ItemID?.price || 0) * item.ItemQty}`,
  ]);

  autoTable(doc, {
    startY: 80,
    margin: { left: 20, right: 20 },
    head: tableHead,
    body: tableBody,
    theme: "grid", // Changed to grid for better header container rendering
    headStyles: {
      fillColor: [173, 216, 230], 
      fontSize: 9,
      fontStyle: "bold",
      halign: "center",
      cellPadding: 4,
    },
    styles: {
      fontSize: 9,
      cellPadding: 5,
      textColor: [40, 40, 40],
      font: "helvetica",
      lineColor: [240, 240, 240], // Light grid lines
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { halign: "left" },
      1: { halign: "center" },
      2: { halign: "center" },
      3: { halign: "right", fontStyle: "bold" },
    },
    // Adding dashed lines back for the body rows
    didDrawCell: (data) => {
      if (data.section === 'body') {
        doc.setDrawColor(235);
        doc.setLineDash([1, 1], 0);
        doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height);
        doc.setLineDash([], 0);
      }
    }
  });

  /* ================= 4. GRAND TOTAL BOX ================= */
  const finalY = doc.lastAutoTable.finalY + 10;
  
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(20, finalY, pageWidth - 40, 20, 1, 1, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text("Grand Total", 25, finalY + 8);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text("Inclusive of all taxes", 25, finalY + 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(0,0,0); // Total price in orange
  doc.text(`Rs. ${total.toLocaleString()}`, pageWidth - 25, finalY + 12, { align: "right" });

  /* ================= 5. PAGE FOOTER ================= */
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150);
  // Positioned at the very bottom (pageHeight - 10mm)
  doc.text(
    "© 2026 Food Order System • Secure Transaction",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  return doc;
};

  const downloadPDF = () => {
    const doc = generatePDF(selectedOrder);
    doc.save(`Order_${selectedOrder._id}.pdf`);
  };

  const shareOrder = async () => {
    const doc = generatePDF(selectedOrder);
    const pdfBlob = doc.output("blob");
    const file = new File([pdfBlob], "invoice.pdf", { type: "application/pdf" });

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Order Invoice",
          text: "Check out my food order receipt!",
          files: [file],
        });
      } catch (err) {
        console.log("Sharing failed", err);
      }
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  // Data Preparation for Table
  const tableData = orders
    .filter((item) => 
        item.OrderBy?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.Status?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((item, index) => {
      const total = item.Order?.reduce((sum, i) => sum + (i.ItemID?.price || 0) * i.ItemQty, 0) || 0;
      return {
        srNo: index + 1,
       datetime: item.createdDateTime
  ? formatDateTime(item.createdDateTime)
  : "-",
        orderby: item.OrderBy?.name || "-",
        payment: item.PaymentMethod || "-",
        status: item.Status || "Pending",
        totalAmount: `Rs. ${total}`,
        completed: item.Status === "Completed" ? "Yes" : "No",
        id: item._id
      };
    });
 

  return (
   <div className="app">
        <div>
       <header className="header">
            <h3 style={{ textAlign: 'left' }}>
              <b>Order History</b>
      
      </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
              <div className="search-bar" style={{ flex: "1", position: "relative" }}>
                <i className="fa fa-fw fa-lg fa-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
           
            </div>




          </header>
       <div className=" table-bordered table " style={{ marginTop: '15px', maxHeight: '600px', overflow: 'auto' ,textAlign:"left" }}>

      <DataTable value={tableData} paginator rows={10} stripedRows loading={loading} className="shadow-sm" tableStyle={{ minWidth: "50rem"  }}  emptyMessage="No records found.">
        <Column field="srNo" header="Sr. No"  className="haappy"         headerClassName='text-center' />
        <Column field="datetime" header="DateTime"   className="haappy"            headerClassName='text-center'/>
        <Column field="orderby" header="Order By"   className="haappy"      headerClassName='text-center' />
        <Column field="payment" header="Payment Method"    className="haappy"      headerClassName='text-center' />
        <Column field="status" header="Status"         headerClassName='text-center'/>
        <Column field="totalAmount" header="Total Amount"     className="haappy"      headerClassName='text-center' />
        <Column field="completed" header="Complete Order"    className="haappy"          headerClassName='text-center' />
        <Column 
          header="View Details" 
        headerClassName='text-center'className="haappy"   
          body={(rowData) => (
            <button className="btn btn-sm btn-outline-primary centered" onClick={() => openDetails(rowData.id)} style={{
              margin:0
            }}>
              View
            </button>
          )} 
        />
      </DataTable>
</div>
</div>

      {/* DETAILS MODAL */}
  <Modal show={showModal} onHide={() => setShowModal(false)} aria-labelledby="contained-modal-title-vcenter"
        size="lg" centered style={{overflowY: 'auto'} } className="hide-scrollbar">
  {/* Header with Title and Close Button */}
  <Modal.Header closeButton className="p-2 px-4">
    <Modal.Title className="fs-6 fw-bold text-secondary text-uppercase" style={{ letterSpacing: '1px' }}>
      Order Invoice
    </Modal.Title>
  </Modal.Header>

  {/* Scrollable Modal Body */}
  <Modal.Body className="pl-5 pr-5 hide-scrollbar" style={{ maxHeight: '75vh', overflowY: 'auto', backgroundColor: '#fdfdfd' }}>
    {selectedOrder && (
      <div className="containermodle p-5 me-5">
        {/* Restaurant Brand Header */}
        <div className="text-center mb-4">
          <h4 className="fw-bold m-0" style={{ fontFamily: 'serif', color: '#1a1a1a' }}>ORDER INVOICE</h4>
          <p className="text-muted small mb-1">ID: {selectedOrder._id?.toUpperCase()}</p>
          <div className="d-flex justify-content-center align-items-center gap-2">
            <div style={{ height: '1px', width: '30px', background: '#ccc' }}></div>
            <i className="pi pi-star-fill text-warning" style={{ fontSize: '0.7rem' }}></i>
            <div style={{ height: '1px', width: '30px', background: '#ccc' }}></div>
          </div>
        </div>

  {/* Bill Metadata Grid */}
        <div className="row g-3 mb-4" style={{ fontSize: '0.9rem' }}>
          <div className="col-6">
            <span className="text-muted d-block small fw-bold text-uppercase">Table Number</span>
            <span className="fw-bold fs-5 text-dark">{selectedOrder.TableNo}</span>
          </div>
          <div className="col-6 text-end">
            <span className="text-muted d-block small fw-bold text-uppercase">Date & Time</span>
            <span className="text-dark">{formatDateTime(selectedOrder.createdDateTime)}</span>
          </div>
          <div className="col-6 mt-2" >
                <span className="text-muted d-block small fw-bold text-uppercase ">ORDER BY :</span>
                <span className="fw-bold fs-5 text-dark">{selectedOrder.OrderBy?.name || "Guest"}</span>
          </div>
          <div className="col-6 text-end mt-1">
             <span className="text-muted d-block small fw-bold text-uppercase">Payment Mode</span>
            <span className="fw-medium text-uppercase text-dark">{selectedOrder.PaymentMethod}</span>
            {/* <span className="text-muted d-block small fw-bold text-uppercase">Order Status</span>
            <span className={`fw-bold ${selectedOrder.Status === 'Completed' ? 'text-success' : 'text-danger'}`}>
              {selectedOrder.Status?.toUpperCase()}
            </span> */}
          </div>
        </div>
        {/* Proper Itemized Bill Table */}
    <div>
  <table className="table table-borderless mb-0 table-dashed">
    <thead className="header">
      <tr className="tableborder">
        <th className="py-3 px-0 text-uppercase small fw-bold">
          Menu Item
        </th>
        <th className="py-3 text-center text-uppercase small fw-bold">
          Price
        </th>
        <th className="py-3 text-center text-uppercase small fw-bold">
          Qty
        </th>
        <th className="py-3 px-0 text-end text-uppercase small fw-bold">
          Total
        </th>
      </tr>
    </thead>

    <tbody>
      {selectedOrder.Order.map((item, i) => (
        <tr key={i} style={{ verticalAlign: "middle" }}>
          <td className="py-3 px-0">
            <div className="fw-bold text-dark">
              {item.ItemID?.name}
            </div>

          </td>
 <td className="py-3 text-center fw-medium">
  ₹{item.ItemID?.price || 0}
          </td>
          <td className="py-3 text-center fw-medium">
            x{item.ItemQty}
          </td>

          <td className="py-3 px-0 text-end fw-bold">
            ₹{(item.ItemID?.price || 0) * item.ItemQty}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        {/* Grand Total Calculation */}
        <div className="mt-4 p-3 rounded" style={{ backgroundColor: '#f8f9fa', border: '1px solid #eee' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="m-0 fw-bold">Grand Total</h6>
              <small className="text-muted">Inclusive of all taxes</small>
            </div>
            <h5 className="m-0 fw-bold text-dark">
              ₹{selectedOrder.Order.reduce((sum, item) => sum + (item.ItemID?.price || 0) * item.ItemQty, 0)}
            </h5>
          </div>
        </div>

        {/* Bill Footer Message */}
        <div className="text-center mt-4 text-muted small">
        <p>© 2026 Food Order System • Secure Transaction</p>
      </div>
      </div>
    )}
  </Modal.Body>

  {/* Sticky Footer Action Buttons */}
  <Modal.Footer className="justify-content-center gap-3 border-0 p-3  shadow-sm">
    <Button
      variant="outline-dark"
      className="d-flex align-items-center justify-content-center py-2 px-4 shadow"
      style={{ borderRadius: '50px', minWidth: '150px', fontWeight: '600' }}
      onClick={downloadPDF}
    >
      <i className="pi pi-download me-2"></i> Download
    </Button>

    <Button
      variant="outline-dark"
      className="d-flex align-items-center justify-content-center py-2 px-4 shadow"
      style={{ borderRadius: '50px', minWidth: '150px', fontWeight: '600' }}
      onClick={shareOrder}
    >
      <i className="pi pi-share-alt me-2"></i> Share Bill
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
};

export default Content;