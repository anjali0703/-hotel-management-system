// ===============================
// UPDATED FILE : src/components/pages/AverageOrder.jsx
// Same style as User page
// Search + Pagination + PrimeReact Table + Better PDF
// ===============================

import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "bootstrap/dist/css/bootstrap.min.css";
import "../../../App.css";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { ProgressSpinner } from "primereact/progressspinner";

const AverageOrder = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${apiUrl}/orders/all`);
      const orders = res.data || [];

      const completedOrders = orders.filter(
        (item) => item.Status === "Completed"
      );

      const now = new Date();

      const dailyOrders = completedOrders.filter((item) => {
        const d = new Date(item.createdDateTime);
        return (
          d.getDate() === now.getDate() &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });

      const weeklyOrders = completedOrders.filter((item) => {
        const d = new Date(item.createdDateTime);
        const diff = (now - d) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      });

      const monthlyOrders = completedOrders.filter((item) => {
        const d = new Date(item.createdDateTime);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });

      const makeRow = (srNo, label, list) => {
        const revenue = list.reduce((sum, order) => {
          const total =
            order.Order?.reduce(
              (s, item) =>
                s + (item.ItemID?.price || 0) * (item.ItemQty || 0),
              0
            ) || 0;

          return sum + total;
        }, 0);

        const totalOrders = list.length;

        const avg = totalOrders > 0 ? revenue / totalOrders : 0;

        return {
          no: srNo,
          period: label,
          revenue: revenue.toFixed(2),
          orders: totalOrders,
          avg: avg.toFixed(2),
        };
      };

      setReportData([
        makeRow(1, "Daily", dailyOrders),
        makeRow(2, "Weekly", weeklyOrders),
        makeRow(3, "Monthly", monthlyOrders),
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Search Filter
  const filteredData = reportData.filter((item) =>
    item.period.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // PDF Export
const exportPDF = () => {
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();

  // ================= TITLE =================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Average Order Report", pageWidth / 2, 18, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    pageWidth / 2,
    25,
    { align: "center" }
  );

  // ================= TABLE =================
  autoTable(doc, {
    startY: 35,

    head: [[
      "Sr No",
      "Time Period",
      "Total Revenue (Rs)",
      "Total Orders",
      "Avg Order Value (Rs)"
    ]],

    body: reportData.map((item, index) => [
      index + 1,   // ✅ Fix Sr No
      item.period,
      item.revenue,
      item.orders,
      item.avg
    ]),

    theme: "grid",

    styles: {
      fontSize: 10,
      cellPadding: 4,
      halign: "center",
      valign: "middle",
    },

    headStyles: {
      fillColor: [29, 120, 148],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 10,
    },

    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },

    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 40 },
      2: { cellWidth: 45 },
      3: { cellWidth: 35 },
      4: { cellWidth: 45 },
    },
  });

  // ================= FOOTER =================
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    "Food Order System © 2026",
    pageWidth / 2,
    285,
    { align: "center" }
  );

  doc.save("AverageOrders.pdf");
};
  return (
    <div className="app">
      <div>
        {/* HEADER */}
        <header className="header">
        <div className="d-flex justify-content-between align-items-center mb-3">
  <h3 className="fw-bold">Average Order</h3>

  <button
    className="btn btn-primary"
    onClick={exportPDF}
  >
    Export Avg Orders
  </button>
</div>
        </header>

        {/* TABLE */}
        <div
          className="table-bordered table"
          style={{
            marginTop: "15px",
            maxHeight: "600px",
            overflow: "auto",
            textAlign: "left",
          }}
        >
          <DataTable
            value={filteredData}
            stripedRows
            paginator
            rows={10}
            tableStyle={{ minWidth: "50rem" }}
            emptyMessage="No records found."
            loading={loading}
            loadingIcon={
              loading ? (
                <ProgressSpinner
                  style={{ width: "50px", height: "50px" }}
                />
              ) : (
                ""
              )
            }
          >
            <Column
              field="no"
              header="Sr No."
              className="primeBody"
              headerClassName="text-center"
            />

            <Column
              field="period"
              header="Time Period"
              className="primeBody"
              headerClassName="text-center"
            />

            <Column
              field="revenue"
              header="Total Revenue (₹)"
              className="primeBody"
              headerClassName="text-center"
            />

            <Column
              field="orders"
              header="Total Orders"
              className="primeBody"
              headerClassName="text-center"
            />

            <Column
              field="avg"
              header="Avg Orders Value (₹)"
              className="primeBody"
              headerClassName="text-center"
            />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default AverageOrder;