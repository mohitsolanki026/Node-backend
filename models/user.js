const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  // shopeOwnerName: {
  //   type: String,
  //   required: true,
  // },
  shopName: {
    type: String,
    required: true,
  },
  pinCode: {
    type: Number,
  },
  // city: {
  //   type: String,
  // },
  // state: {
  //   type: String,
  // },
  // address: {
  //   type: String,
  // },
  inventory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'inventory',
  },
  purchases: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'purchase',
  }
], 
}, {
  timestamps: true
});

module.exports = mongoose.model("user",userSchema);