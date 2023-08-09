const mongoose = require("mongoose");

const medicineSchema = mongoose.Schema({
  medicineName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  packageType: {
    type: String,
    require: true,
  },
  MRP: {
    type: Number,
    required: true,
  },
  pack: {
    type: String,
    require: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  expireDate: {
    type: Date,
  },
  batchCode: {
    type: String,
  },
});

const inventorySchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  medicines: [medicineSchema],
  expireMed: [medicineSchema],
  outOfStock: [medicineSchema],
}, {
  timestamps: true
});

module.exports = mongoose.model("inventory", inventorySchema);
