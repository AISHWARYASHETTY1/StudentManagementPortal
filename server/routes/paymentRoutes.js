const express = require("express");
const { getAllPayments, addPayment } = require("../controllers/paymentController");

const router = express.Router();

// Get all payments
router.get("/", getAllPayments);

// Record new payment
router.post("/", addPayment);

module.exports = router;
