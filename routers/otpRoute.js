const router = require("express").Router();
const otpController = require("../Controllers/otpController");

router.post("/generate",otpController.generateOtp);
router.post("/verify",otpController.verifyOtp);

module.exports = router;