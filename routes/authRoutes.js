const express = require("express");
const router = express.Router();
const signupController = require("../controllers/authControllers/signupController");
const loginController = require("../controllers/authControllers/loginController");

router.post("/signup", signupController.signup);
router.post("/login", loginController.login);

module.exports = router;
