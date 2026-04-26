const mongoose = require("mongoose");
const UserType = require("./UserType");
const Schema = mongoose.Schema;

// Users Schema
const userSchema = new mongoose.Schema({
  name: { type: String, default: null },
  email: { type: String, required: true },
  password: { type: String, required: true },
  mobile: { type: Number, required: true },
  userTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'isusertype', default: null },
  active: { type: Boolean, default: true }, // Default to true
  deleted: { type: Boolean, default: false }, // Default to false
  createdBy: { type: String, default: null },
  createdDateTime: { type: Date, default: Date.now }, // Default to current date and time
  modifiedBy: { type: String, default: null },
  modifiedDateTime: { type: Date, default: null },
  deletedBy: { type: String, default: null },
  deletedDateTime: { type: Date, default: null },
});

const User = mongoose.model("isuser", userSchema);

module.exports = User;
