const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, default: null },
  image: { type: String, default: null },
  price: { type: String, default: null },
  description: { type: String, default: null },

  menucategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ismenucategories",
    default: null,
  },

  available: { type: Boolean, default: true },
  type: { type: String, default: true },

  active: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false },

  createdBy: { type: String, default: null },
  createdDateTime: { type: Date, default: Date.now },

  modifiedBy: { type: String, default: null },
  modifiedDateTime: { type: Date, default: null },

  deletedBy: { type: String, default: null },
  deletedDateTime: { type: Date, default: null },
});

module.exports = mongoose.model("ismenuitem", MenuItemSchema);