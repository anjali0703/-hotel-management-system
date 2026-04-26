const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./src/routes/users");
const userTypeRoutes = require("./src/routes/userTypes");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from 'Upload' directory
const uploadDir = path.join(__dirname, "src", "Upload");
app.use("/Upload", express.static(uploadDir));
//
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/buysmart_client", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 100,            // Set maxPoolSize to 100, based on expected concurrent connections.
  minPoolSize: 10,             // Set minPoolSize to keep some connections alive.
  // socketTimeoutMS: 45000,      // (45 seconds) Increase socket timeout to avoid premature disconnections.
  // connectTimeoutMS: 30000,     // (30 seconds) Increase connect timeout to allow more time for initial connection.
  // serverSelectionTimeoutMS: 5000, // (5 seconds) Timeout for server selection.
  // family: 4,                   // Force IPv4 (optional, useful in certain environments)
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/userTypes", userTypeRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
