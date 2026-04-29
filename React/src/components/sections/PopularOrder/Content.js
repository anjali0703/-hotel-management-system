import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";import "bootstrap/dist/css/bootstrap.min.css";
// PrimeReact Imports
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { ProgressSpinner } from 'primereact/progressspinner';

import "../../../App.css";

const PopularOrderReport = () => {
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
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setAllOrders(data);
    } catch (error) {
      console.log("FETCH ERROR =", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= DATE FILTER LOGIC =================
  const checkDate = (date) => {
    const d = new Date(date);
    if (filterType === "All") return true;

    if (filterType === "Daily") {
      return d.toDateString() === new Date().toDateString();
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

  // ================= APPLY FILTER & MAP DATA =================
  const applyFilter = () => {
    const filteredOrders = allOrders.filter((x) => checkDate(x.createdDateTime));

    let itemMap = {};

    filteredOrders.forEach((order) => {
      order.Order?.forEach((item) => {
        const name = item?.ItemID?.name || "Unknown Item";
        const category = 
          item?.ItemID?.menucategoryId?.name || 
          item?.ItemID?.menucategoryId?.title || 
          "Unknown";
        
        const qty = Number(item.ItemQty || 0);

        if (!itemMap[name]) {
          itemMap[name] = { name, category, sold: 0 };
        }
        itemMap[name].sold += qty;
      });
    });

    let arr = Object.values(itemMap);

    // Search Filter
    if (searchTerm) {
      arr = arr.filter((x) =>
        x.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by Popularity (Most Sold First)
    arr.sort((a, b) => b.sold - a.sold);

    // Format for Table
    let finalData = arr.map((x, i) => ({
      srNo: i + 1,
      name: x.name,
      category: x.category,
      sold: x.sold,
    }));

    // Add Total Row
    const totalSold = finalData.reduce((a, b) => a + Number(b.sold || 0), 0);

    if (totalSold > 0) {
      finalData.push({
        srNo: "TOTAL",
        name: "All Items",
        category: "-",
        sold: totalSold,
      });
    }

    setTableData(finalData);
  };

  // ================= PDF EXPORT =================
  const exportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(18);
    doc.text("Popular Orders Report", 14, 18);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25);

    autoTable(doc, {
      startY: 32,
      theme: "grid",
      head: [["Sr No", "Item Name", "Category", "Orders Sold"]],
      body: tableData.map((x) => [x.srNo, x.name, x.category, x.sold]),
      headStyles: { fillColor: [29, 120, 148], textColor: 255 }
    });
    doc.save("PopularOrdersReport.pdf");
  };

  return (
    <div className="app">
      <header className="header">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-0"><b>Popular Orders</b></h3>
          <button className="btn btn-primary mb-3" onClick={exportPDF}>
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

          {/* FILTER DROPDOWN TOGGLE */}
             <div className="search-bar" style={{ flexShrink: "0",position:"relative" }}>
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
                        setShowFilter(false);
                        if (type === "Monthly" || type === "Date Range") {
                          setShowDatePanel(true);
                        } else {
                          setShowDatePanel(false);
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

      {/* DATE PICKER PANEL */}
      {showDatePanel && (
        <div className="card border-0 shadow-sm p-4 mt-3" style={{ backgroundColor: "#f8f9fa", borderRadius: "12px" }}>
          <div className="row g-3 align-items-end">
            {filterType === "Monthly" ? (
              <div className="col-md-4">
                <label className="form-label fw-bold small text-muted">Select Month</label>
                <input
                  type="month"
                  className="form-control border-0 shadow-sm"
                  style={{ height: "45px" }}
                  onChange={(e) => {
                    const val = e.target.value;
                    const [year, month] = val.split("-");
                    const start = new Date(year, month - 1, 1);
                    const end = new Date(year, month, 0);
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

      {/* DATA TABLE SECTION */}
      <div className="table-bordered table" style={{ marginTop: '15px', maxHeight: '600px', overflow: 'auto' }}>
        <DataTable
          value={tableData}
          stripedRows
          paginator
          rows={10}
          emptyMessage="No orders found."
          loading={loading}
          loadingIcon={<ProgressSpinner style={{ width: "50px", height: "50px" }} />}
          rowClassName={(row) => (row.srNo === "TOTAL" ? "total-row" : "")}
        >
          <Column field="srNo" header="Sr. No" headerClassName="text-center" />
          <Column field="name" header="Item Name" headerClassName="text-center" />
          <Column field="category" header="Category" headerClassName="text-center" />
          <Column field="sold" header="Order Sold" headerClassName="text-center" />
        </DataTable>
      </div>
    </div>
  );
};

export default PopularOrderReport;