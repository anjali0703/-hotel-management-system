const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Users Schema
const OrderSchema = new Schema({
  TableNo: { type: String, default: null },
  Order: [
    {
      ItemID: { type: mongoose.Schema.Types.ObjectId, ref: 'ismenuitem', required: true },
      ItemQty: { type: Number, required: true },
      Status: { type: String, required: true },
      Note: { type: String, required: false },
    }
  ],
  Note: { type: String, default: null },
  Status: { type: String, required: true },
PaymentStatus: {
  type: String,
  default: "PENDING" // PENDING | PAID | FAILED
},

PaymentMethod: {
  type: String, // CASH | ONLINE
},

paidAt: Date,
  Bill: { type: String, required: false },
  OrderBy: { type: mongoose.Schema.Types.ObjectId, ref: 'isuser', required: false },
  active: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false },
  createdBy: { type: String, default: null },
  createdDateTime: { type: Date, default: Date.now },
  modifiedBy: { type: String, default: null },
  modifiedDateTime: { type: Date, default: null },
  deletedBy: { type: String, default: null },
  deletedDateTime: { type: Date, default: null },
});

const Order = mongoose.model("isorder", OrderSchema);

module.exports = Order;