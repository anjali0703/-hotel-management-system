const mongoose = require("mongoose");

const userTypeSchema = new mongoose.Schema({
  userType: {
    type: String,
    required: true,
    enum: ["Admin", "WaitStaff", "KitchenOrder"], // Restrict to specific values
  },
  active: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false },
  createdBy: { type: String, default: null },
  createdDateTime: { type: Date, default: Date.now }, // Ensure this field is properly set
  modifiedBy: { type: String, default: null },
  modifiedDateTime: { type: Date, default: null },
  deletedBy: { type: String, default: null },
  deletedDateTime: { type: Date, default: null },
});

const UserType = mongoose.model("isusertype", userTypeSchema);

module.exports = UserType;
