const router = require("express").Router();
const authController = require("../Controllers/authController");

router.post("/signup",authController.signupController);
router.post("/login", authController.loginController);
router.get("/refresh",authController.refreshAccessTokenController);
router.get("/logout",authController.logoutController);

module.exports = router;