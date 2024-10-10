const express = require("express");
const router = express.Router();
const userAuthController = require("../controllers/user/authController")


router.post("/createUser",userAuthController.createUser)
router.post('/login', userAuthController.login);
router.post('/refresh-token', userAuthController.refreshToken);
router.post('/logout', userAuthController.logout);

module.exports = router;
