const mongoose = require("mongoose");

const otp = mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10,
    },
    otp: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model("otp",otp);