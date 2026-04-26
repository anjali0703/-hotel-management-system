// src/models/MenuCategory.js
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },

  // stores either:
  // "starters.jpg" OR "uploads/categories/123.jpg"
  image: { type: String, default: null },

  active: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false },

  createdBy: { type: String, default: null },
  createdDateTime: { type: Date, default: Date.now },

  modifiedBy: { type: String, default: null },
  modifiedDateTime: { type: Date, default: null },

  deletedBy: { type: String, default: null },
  deletedDateTime: { type: Date, default: null },
});

module.exports = mongoose.model("ismenucategories", CategorySchema);