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
      required: true,
    },
    pack: {
      type: String,
      required: true,
    },
    MRP:{
        type: Number,
        required: true,
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
  

const purchaseSchema = mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    medicines:[medicineSchema],
    // distributer: {
    //    type: mongoose.Schema.Types.ObjectId,
    //     ref: "distributer",
    // },
    billNo: {
        type: String,
    },
    refrenceNo: {
      type: String,
    },
    date:{
      type: Date,
      required: true,
    },
    gstin:{
      type: String,

    },
    subTotal:{
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
    },
    tax:{
      type: Number,
    },
    grandTotal: {
      type: Number,
      required: true,
    }
}, {
  timestamps: true
});

module.exports = mongoose.model("purchase",purchaseSchema);
