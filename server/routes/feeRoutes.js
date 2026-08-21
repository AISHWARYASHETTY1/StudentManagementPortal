const express = require("express");
const { getAllFees, addFee, updateFeeStatus } = require("../controllers/feeController");

const router = express.Router();

// Get all fees
router.get("/", getAllFees);

// Add new fee
router.post("/", addFee);

// Update fee status
router.put("/:feeId/status", updateFeeStatus);

module.exports = router;
