const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema({
  Tnumber: { type: Number, required: true },
  capacity: { type: Number, required: true },
  status: { type: String, required: true },
  active: { type: Boolean, default: true },
  qrCode: { type: String, default: null },
  // Soft Delete Flags
  assignedWaiter: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "isuser",
  default: null
},
occupiedAt: {
  type: Date,
  default: null
},
  deleted: { type: Boolean, default: false },
  deletedDateTime: { type: Date, default: null },
  
  // Audit Trail - Timestamps
  createdDateTime: { type: Date, default: Date.now },
  modifiedDateTime: { type: Date, default: Date.now },

  // Audit Trail - User Tracking
  // Replace "User" with the actual name of your User model
createdBy: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: "isuser", 
  default: null 
},
modifiedBy: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: "isuser", 
  default: null 
},
deletedBy: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: "isuser", 
  default: null 
}
});

const Tables = mongoose.model("istables", TableSchema);

module.exports = Tables;