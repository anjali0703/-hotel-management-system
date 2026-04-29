
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import toastr from "toastr";
import Swal from "sweetalert2";
import "react-data-table-component-extensions/dist/index.css";

import "../../../assets/css/toastr.min.css"
import "../../../App.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-blue/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // Core CSS
import "primeicons/primeicons.css"; // Icons
import { ProgressSpinner } from 'primereact/progressspinner';
const CategorySalesReport = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [allOrders, setAllOrders] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDatePanel, setShowDatePanel] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
console.log(tableData);
  // ================= LOAD =================
  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [allOrders, searchTerm, filterType]);

  // ================= FETCH =================
const fetchOrders = async () => {
  try {
    setLoading(true);

    const res = await axios.get(`${apiUrl}/orders/category-sales`);

    console.log("API RESPONSE =", res.data);

    const completed = Array.isArray(res.data.data)
      ? res.data.data
      : [];

    setAllOrders(completed);

  } catch (error) {
    console.log("FETCH ERROR =", error);
  } finally {
    setLoading(false);
  }
};

  // ================= DATE FILTER =================
const checkDate = (date) => {
  const d = new Date(date);

  const sd = new Date(startDate);
  const ed = new Date(endDate);
  ed.setHours(23, 59, 59, 999);

  if (filterType === "All") return true;

  if (filterType === "Daily") {
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }

  if (filterType === "Last 7 Days") {
    const now = new Date();
    return (now - d) / (1000 * 60 * 60 * 24) <= 7;
  }

 if (filterType === "Monthly" || filterType === "Date Range") {
  const sd = new Date(startDate);
  const ed = new Date(endDate);
  ed.setHours(23, 59, 59, 999);

  return d >= sd && d <= ed;
}

  return true;
};

  // ================= REPORT =================
 const applyFilter = () => {
  const filteredOrders = allOrders.filter((x) =>
    checkDate(x.createdDateTime)
  );

  let categoryMap = {};

  filteredOrders.forEach((order) => {
    order.Order?.forEach((item) => {
      let category = "Unknown";

      if (item?.ItemID?.menucategoryId) {
        const c = item.ItemID.menucategoryId;

        if (typeof c === "string") {
          category = c;
        } else if (typeof c === "object") {
          category =
            c.name ||
            c.title ||
            c.category ||
            "Unknown";
        }
      }

      category = String(category);

      const qty = Number(item.ItemQty || 0);
      const price = Number(item.ItemID?.price || 0);
      const revenue = qty * price;

      if (!categoryMap[category]) {
        categoryMap[category] = {
          category,
          sold: 0,
          revenue: 0,
        };
      }

      categoryMap[category].sold += qty;
      categoryMap[category].revenue += revenue;
    });
  });

  let arr = Object.values(categoryMap);

  // SEARCH FILTER
  if (searchTerm) {
    arr = arr.filter((x) =>
      String(x.category)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }

  // TOTAL REVENUE (before formatting)
  const totalRevenue = arr.reduce(
    (sum, x) => sum + x.revenue,
    0
  );

  // FORMAT ROWS
  arr = arr.map((x, i) => ({
    srNo: i + 1,
    category: String(x.category),
    sold: Number(x.sold),
    revenue: Number(x.revenue),
    percent:
      totalRevenue > 0
        ? ((x.revenue / totalRevenue) * 100).toFixed(2) + "%"
        : "0%",
    avg:
      x.sold > 0
        ? (x.revenue / x.sold).toFixed(2)
        : "0.00",
  }));

  // TOTALS
  const totalSold = arr.reduce(
    (a, b) => a + Number(b.sold || 0),
    0
  );

  const totalRevenueFinal = arr.reduce(
    (a, b) => a + Number(b.revenue || 0),
    0
  );

if (totalSold > 0) {
  arr.push({
    srNo: "TOTAL",
    category: "All Categories",
    sold: totalSold,
    revenue: totalRevenueFinal.toFixed(2),
    percent: "100%",
    avg: "-"
  });
}

  // FINAL SET STATE
  setTableData(arr);


};

  // ================= PDF =================
  const exportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFontSize(18);
    doc.text("Category Sales Report", 14, 18);

    doc.setFontSize(10);
    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      14,
      25
    );

    autoTable(doc, {
      startY: 32,
      theme: "grid",

      head: [[
        "Sr No",
        "Category",
        "Items Sold",
        "Revenue",
        "Percentage",
        "Avg Category"
      ]],

      body: tableData.map((x) => [
        x.srNo,
        String(x.category),
        x.sold,
        x.revenue,
        x.percent,
        x.avg
      ]),

      headStyles: {
        fillColor: [29, 120, 148],
        textColor: 255
      }
    });

    doc.save("CategorySalesReport.pdf");
  };

  // ================= TOTALS =================
 


  return (
    <div className="app">
      <div>

          <header className="header">
           <div className="d-flex justify-content-between align-items-center">
  
  <h3 className="mb-0">
    <b>Category Sales Orders</b>
  </h3>

  <button
    className="btn btn-primary mb-3"
    onClick={exportPDF}
  >
    Export PDF
  </button>

</div>
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

            {/* FILTER */}
     <div className="search-bar" style={{ flexShrink: "0" ,position:"relative"}}>
                 <button className="add-btn"  onClick={() => setShowFilter(!showFilter)}>
                  <i class="fas fa-sliders-h h5" style={{ cursor: "pointer", color: "#DA6317",background:"none" }}></i>
              
                </button>
        
            

  {/* BEAUTIFUL DROPDOWN MENU */}
  {showFilter && (
    <div
      className="card shadow-lg border-0 mt-2"
      style={{
        position: "absolute",
        top: "45px",
        right: 0,
        width: "200px",
        zIndex: 1000,
        borderRadius: "8px",
        overflow: "hidden"
      }}
    >
      <div className="list-group list-group-flush">
        {["All", "Daily", "Last 7 Days", "Monthly", "Date Range"].map((type) => (
          <button
            key={type}
            className={`list-group-item list-group-item-action border-0 py-2 px-3 d-flex justify-content-between align-items-center ${
              filterType === type ? "bg-light fw-bold text-primary" : ""
            }`}
            onClick={() => {
  setFilterType(type);

  // close dropdown always
  setShowFilter(false);

  // show date panel only for these
  if (type === "Monthly" || type === "Date Range") {
    setShowDatePanel(true);
    return;
  }

  // hide date panel for others
  setShowDatePanel(false);

  // auto apply filter for simple types
  if (type === "All" || type === "Daily" || type === "Last 7 Days") {
    applyFilter();
  }
}}
          >
            {type === "Date Range" ? "Custom Dates" : type}
            {filterType === type && <i className="fa fa-check small"></i>}
          </button>
        ))}
      </div>
    </div>
  )}
</div>
          </div>
        </header>

{showDatePanel &&  (
  <div className="card border-0 shadow-sm p-4 mt-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "12px" ,boxShadow:"2px 0px black" }}>
    <div className="row g-3 align-items-end">
      
      {filterType === "Monthly" ? (
        <div className="col-md-4">
          <label className="form-label fw-bold small text-muted">Select Month</label>
          <input
            type="month"
            className="form-control border-0 shadow-sm"
            style={{ height: "45px" }}
           onChange={(e) => {
  const val = e.target.value; // YYYY-MM
  const [year, month] = val.split("-");

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0); // last day of month

  setStartDate(start.toISOString().split("T")[0]);
  setEndDate(end.toISOString().split("T")[0]);
}}
          />
        </div>
      ) : (
        <>
          <div className="col-md-4">
            <label className="form-label fw-bold small text-muted">Start Date</label>
            <input
              type="date"
              className="form-control border-0 shadow-sm"
              style={{ height: "45px" }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-bold small text-muted">End Date</label>
            <input
              type="date"
              className="form-control border-0 shadow-sm"
              style={{ height: "45px" }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="col-md-2">
      <button
  className="btn btn-primary w-100 shadow-sm fw-bold"
  style={{ height: "45px", borderRadius: "8px" }}
  onClick={() => {
    applyFilter();
    setShowDatePanel(false);
  }}

>
  Apply Filter
</button>
      </div>
    </div>
  </div>
)}
          <div className=" table-bordered table " style={{ marginTop: '15px', maxHeight: '600px', overflow: 'auto' ,textAlign:"left" }}>
        {/* TABLE */}
       <DataTable
  value={tableData}
  stripedRows
  paginator
  rows={10}
  tableStyle={{ minWidth: "50rem" }}
  emptyMessage="No records found."
  loading={loading}
  loadingIcon={loading ?<ProgressSpinner style={{ width: "50px", height: "50px" }}  />: ''}
 rowClassName={(row) =>
  row.srNo === "TOTAL" ? "total-row" : ""
}
>
  <Column
    field="srNo"
    header="Sr. No"
    className="primeBody"
    headerClassName="text-center"
  />

  <Column
    field="category"
    header="Category"
    className="primeBody"
    headerClassName="text-center"
  />

  <Column
    field="sold"
    header="Items Sold"
    className="primeBody"
    headerClassName="text-center"
  />

  <Column
    field="revenue"
    header="Revenue (Rs)"
    className="primeBody"
    headerClassName="text-center"
  />

  <Column
    field="percent"
    header="Percentage(%)"
    className="primeBody"
    headerClassName="text-center"
  />

  <Column
    field="avg"
    header="Avg Category"
    className="primeBody"
    headerClassName="text-center"
  />
</DataTable>
</div>
      </div>
    </div>
  );
};

export default CategorySalesReport;