const express = require("express")
const router = express.Router()
const adminAuthController = require("../controllers/admin/authController")


router.post("/login", adminAuthController.login)

module.exports = router

