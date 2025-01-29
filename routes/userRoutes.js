const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/otp", authController.sendOTP);
router.post("/verify-otp", authController.VerifyOtp);

module.exports = router;