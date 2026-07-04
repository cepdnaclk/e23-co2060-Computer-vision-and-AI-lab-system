const express = require("express");
const router = express.Router();
const { initiateRegistration, verifyRegistration, login } = require("../controllers/authController");

router.post("/register/initiate", initiateRegistration);
router.post("/register/verify", verifyRegistration);
router.post("/login", login);

module.exports = router;