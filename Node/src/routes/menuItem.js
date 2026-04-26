const express = require("express");
const router = express.Router();
const controller = require("../controller/MenuItemController");
const multer = require("multer");

// Image Upload Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ GET with search + category filter
router.get("/menu-items", controller.getMenuItems);

// ✅ SAVE (ADD + UPDATE)
router.post("/menuItems/save", upload.single("image"), controller.saveMenuItem);

// ✅ DELETE
router.delete("/menuItems/:id", controller.deleteMenuItem);

module.exports = router;