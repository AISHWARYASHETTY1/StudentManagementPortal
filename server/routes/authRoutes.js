const express = require("express");

const {
    loginStudent
} = require("../controllers/authController");

const router = express.Router();

router.post("/login", loginStudent);

module.exports = router;