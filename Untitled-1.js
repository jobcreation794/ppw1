const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  memberId: { type: String, unique: true },
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  region: String,
  dob: String,
  address: String,
  photo: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Member", memberSchema);
