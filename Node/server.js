const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const userRoutes = require("./src/routes/users");
const userTypeRoutes = require("./src/routes/userTypes");
const MenuCategory = require("./src/routes/menuCategory");
const MenuItem = require("./src/routes/menuItem");
const Table = require("./src/routes/table");
const Order =require("./src/routes/order");
const authRoutes = require("./src/routes/auth");

const app = express();
const port = process.env.PORT || 5000;

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use(bodyParser.json());
app.use(express.json());

/* ================= STATIC FILES ================= */
app.use("/Upload", express.static(path.join(__dirname, "src", "Upload")));
app.use("/Upload/Reports", express.static(path.join(__dirname, "src", "Upload", "Reports")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/scripts", express.static(path.join(__dirname, "src", "scripts")));

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/userTypes", userTypeRoutes);
app.use("/api/menuCategory", MenuCategory);
app.use("/api/tables", Table);
app.use("/api/orders", Order);
app.use("/api", MenuItem);

/* ================= MONGODB ================= */
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 100,
});

mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB Connected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Error:", err);
});

/* ================= SOCKET SETUP ================= */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://hotel-management-system-coral-seven.vercel.app/"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
global.io = io;

io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

/* ================= START SERVER ================= */
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});