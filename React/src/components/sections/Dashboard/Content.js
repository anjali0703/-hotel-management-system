import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { ProgressSpinner } from "primereact/progressspinner";
import toastr from "toastr";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

const Content = () => {
  const API = process.env.REACT_APP_API_URL;

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("month");

  const [data, setData] = useState({
    stats: {
      totalRevenue: 0,
      totalOrders: 0,
      activeTables: 0,
      totalUsers: 0,
      todayOrders: 0
    },
    monthlyRevenue: [],
    topItems: [],
    statusCounts: []
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/orders/dashboard/summary`
      );

      setData({
        stats: res.data?.stats || {},
        monthlyRevenue:
          res.data?.monthlyRevenue || [],
        topItems: res.data?.topItems || [],
        statusCounts:
          res.data?.statusCounts || []
      });
    } catch (err) {
      toastr.error("Dashboard load failed");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ====================================
  // FILTER REVENUE
  // ====================================

  const getRevenueData = () => {
    const rows = [...data.monthlyRevenue];

    if (filter === "day") return rows.slice(-7);
    if (filter === "week") return rows.slice(-4);
    if (filter === "month") return rows.slice(-12);
    if (filter === "year") return rows.slice(-5);

    return rows;
  };

  const revenueRows = getRevenueData();

  // ====================================
  // CHART DATA
  // ====================================

  const revenueChart = {
    labels: revenueRows.map((x) => x.month),
    datasets: [
      {
        label: "Revenue",
        data: revenueRows.map((x) => x.total),
        fill: true,
        borderColor: "#6366f1",
        backgroundColor:
          "rgba(99,102,241,0.08)",
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 7
      }
    ]
  };

  const topItemsChart = {
    labels: data.topItems.map((x) => x.name),
    datasets: [
      {
        label: "Sold Qty",
        data: data.topItems.map((x) => x.qty),
        backgroundColor: [
          "#6366f1",
          "#8b5cf6",
          "#06b6d4",
          "#14b8a6",
          "#f59e0b"
        ],
        borderRadius: 10
      }
    ]
  };

  const statusChart = {
    labels: data.statusCounts.map(
      (x) => x.status
    ),
    datasets: [
      {
        data: data.statusCounts.map(
          (x) => x.count
        ),
        backgroundColor: [
           "#9a22c5",
          "#0bf5ab",
          "#ef44d2",
            "#3b82f6",
          "#8b5cf6",
         
        
        ],
        borderWidth: 0
      }
    ]
  };

  const compareChart = {
    labels: revenueRows.map((x) => x.month),
    datasets: [
      {
        label: "Revenue",
        data: revenueRows.map((x) => x.total),
        backgroundColor: "#6366f1",
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        padding: 12,
        cornerRadius: 10
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280" }
      },
      y: {
        grid: {
          color: "rgba(0,0,0,0.05)"
        },
        ticks: { color: "#6b7280" }
      }
    }
  };

  // ====================================
  // LOADER
  // ====================================

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "90vh" }}
      >
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div
      className="container-fluid p-4"
      style={{
        background: "#f4f6fb",
        minHeight: "100vh"
      }}
    >
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">
       Dashboard
          </h3>
          <p className="text-muted mb-0">
            Premium restaurant live insights
          </p>
        </div>

        <button
          className="btn btn-dark rounded-pill px-4"
          onClick={loadDashboard}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="row g-4 mb-4">
        {[
          {
            title: "Revenue",
            value: `₹${data.stats.totalRevenue || 0}`,
            icon: "bi-cash-stack",
            color: "#6366f1"
          },
          {
            title: "Orders",
            value:
              data.stats.totalOrders || 0,
            icon: "bi-bag-check",
            color: "#22c55e"
          },
          {
            title: "Today Orders",
            value:
              data.stats.todayOrders || 0,
            icon: "bi-calendar-check",
            color: "#06b6d4"
          },
          {
            title: "Active Tables",
            value:
              data.stats.activeTables || 0,
            icon: "bi-grid",
            color: "#f59e0b"
          },
          {
            title: "Customers",
            value:
              data.stats.totalUsers || 0,
            icon: "bi-people",
            color: "#ef4444"
          }
        ].map((card, i) => (
          <div
            className="col-sm-6 col-xl"
            key={i}
          >
            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "22px"
              }}
            >
              <div className="card-body d-flex align-items-center">
                <div
                  className="p-3 rounded-4"
                  style={{
                    background: `${card.color}15`,
                    color: card.color
                  }}
                >
                  <i
                    className={`bi ${card.icon} fs-3`}
                  ></i>
                </div>

                <div className="ms-3">
                  <small className="text-muted d-block">
                    {card.title}
                  </small>
                  <h4 className="fw-bold mb-0">
                    {card.value}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FIRST ROW */}
      <div className="row g-4 mb-4">
        {/* REVENUE */}
        <div className="col-lg-8">
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "22px"
            }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <div>
                  <h5 className="fw-bold mb-1">
                    Revenue Performance
                  </h5>
                  <small className="text-muted">
                    Smart growth analysis
                  </small>
                </div>

                <select
                  className="form-select border-0 shadow-sm"
                  style={{
                    width: "160px",
                    borderRadius: "12px",
                    fontWeight: "600"
                  }}
                  value={filter}
                  onChange={(e) =>
                    setFilter(
                      e.target.value
                    )
                  }
                >
                  <option value="day">
                    Today
                  </option>
                  <option value="week">
                    Weekly
                  </option>
                  <option value="month">
                    Monthly
                  </option>
                  <option value="year">
                    Yearly
                  </option>
                  <option value="all">
                    All Time
                  </option>
                </select>
              </div>

              <div
                style={{
                  height: "370px"
                }}
              >
                <Line
                  data={revenueChart}
                  options={chartOptions}
                />
              </div>
            </div>
          </div>
        </div>

        {/* STATUS */}
        <div className="col-lg-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderRadius: "22px"
            }}
          >
            <div className="card-body">
              <h5 className="fw-bold mb-4">
                Order Status
              </h5>

              <div
                style={{
                  height: "370px"
                }}
              >
                <Doughnut
                  data={statusChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECOND ROW */}
      <div className="row g-4">
        {/* TOP ITEMS */}
        <div className="col-lg-6">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderRadius: "22px"
            }}
          >
            <div className="card-body">
              <h5 className="fw-bold mb-4">
                Top Selling Products
              </h5>

              <div
                style={{
                  height: "340px"
                }}
              >
                <Bar
                  data={topItemsChart}
                  options={chartOptions}
                />
              </div>
            </div>
          </div>
        </div>

        {/* COMPARISON */}
        <div className="col-lg-6">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              borderRadius: "22px"
            }}
          >
            <div className="card-body">
              <h5 className="fw-bold mb-4">
                Revenue Comparison
              </h5>

              <div
                style={{
                  height: "340px"
                }}
              >
                <Bar
                  data={compareChart}
                  options={chartOptions}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;