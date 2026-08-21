const express = require("express");

const {
    getDashboardData
} = require("../controllers/dashboardController");

const router = express.Router();

router.get("/:studentId", getDashboardData);

module.exports = router;