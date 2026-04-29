import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler
} from "chart.js";
import { ProgressSpinner } from 'primereact/progressspinner';
import toastr from "toastr";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, Title, Tooltip, Legend, Filler
);

const Content = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: { revenue: 0, totalOrders: 0, activeTables: 0, newCustomers: 0 },
    revenueTrend: { labels: [], values: [] },
    topItems: { labels: [], counts: [] },
    recentOrders: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Assuming you have an endpoint that aggregates this data
      const res = await axios.get(`${apiUrl}/orders/dashboard/summary`);
      setDashboardData(res.data);
    } catch (err) {
      toastr.error("Failed to load real-time analytics");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Chart Configurations ---
  const lineChartData = {
    labels: dashboardData.revenueTrend.labels,
    datasets: [{
      label: "Revenue",
      data: dashboardData.revenueTrend.values,
      fill: true,
      backgroundColor: "rgba(13, 110, 253, 0.04)",
      borderColor: "#0d6efd",
      tension: 0.4,
      pointRadius: 2,
    }]
  };

  const barChartData = {
    labels: dashboardData.topItems.labels,
    datasets: [{
      label: "Quantity Sold",
      data: dashboardData.topItems.counts,
      backgroundColor: "#6610f2",
      borderRadius: 10,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#adb5bd" } },
      y: { grid: { borderDash: [5, 5], drawBorder: false }, ticks: { color: "#adb5bd" } }
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{height: '80vh'}}>
      <ProgressSpinner />
    </div>
  );

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#fbfbfb", minHeight: "100vh" }}>
      <header className="mb-4">
        <h3 className="fw-bold text-dark mb-1">Management Insights</h3>
        <p className="text-muted">Live performance data from your database</p>
      </header>

      {/* STAT BLOCKS */}
      <div className="row g-3 mb-4">
        {[
          { label: "Total Revenue", val: `₹${dashboardData.stats.revenue}`, icon: "bi-currency-rupee", col: "#0d6efd" },
          { label: "Orders Today", val: dashboardData.stats.totalOrders, icon: "bi-bag-check", col: "#198754" },
          { label: "Active Tables", val: dashboardData.stats.activeTables, icon: "bi-ui-radios", col: "#fd7e14" },
          { label: "New Users", val: dashboardData.stats.newCustomers, icon: "bi-person-plus", col: "#6f42c1" }
        ].map((stat, i) => (
          <div className="col-12 col-md-6 col-xl-3" key={i}>
            <div className="card border-0 shadow-sm p-3" style={{ borderRadius: "18px" }}>
              <div className="d-flex align-items-center">
                <div className="p-3 rounded-4" style={{ backgroundColor: `${stat.col}10`, color: stat.col }}>
                  <i className={`bi ${stat.icon} h4 mb-0`}></i>
                </div>
                <div className="ms-3">
                  <small className="text-muted fw-medium d-block mb-1">{stat.label}</small>
                  <h4 className="fw-bold mb-0">{stat.val}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* REVENUE CHART */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: "24px" }}>
            <h5 className="fw-bold mb-4">Revenue Stream</h5>
            <div style={{ height: "300px" }}>
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* TOP ITEMS CHART */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: "24px" }}>
            <h5 className="fw-bold mb-4">Best Sellers</h5>
            <div style={{ height: "300px" }}>
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* LIVE ORDER TABLE */}
        <div className="col-12">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "24px" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Live Transactions</h5>
              <button className="btn btn-light btn-sm rounded-pill px-3" onClick={fetchDashboardData}>
                <i className="bi bi-arrow-clockwise me-1"></i> Refresh
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="bg-light">
                  <tr className="text-muted small">
                    <th className="border-0 ps-3">ORDER ID</th>
                    <th className="border-0">TABLE</th>
                    <th className="border-0">AMOUNT</th>
                    <th className="border-0">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentOrders.map((order, idx) => (
                    <tr key={idx}>
                      <td className="ps-3 fw-bold text-primary">#{order._id.slice(-6).toUpperCase()}</td>
                      <td>Table {order.tableNo}</td>
                      <td>₹{order.totalAmount}</td>
                      <td>
                        <span className={`badge rounded-pill px-3 py-2 ${
                          order.status === 'Completed' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;