const express = require("express");
const router = express.Router();
const { initiateRegistration, verifyRegistration, login, googleLogin, forgotPasswordInitiate, resetPassword } = require("../controllers/authController");

router.post("/register/initiate", initiateRegistration);
router.post("/register/verify", verifyRegistration);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/forgot-password/initiate", forgotPasswordInitiate);
router.post("/forgot-password/reset", resetPassword);

module.exports = router;