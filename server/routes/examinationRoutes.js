const express = require("express");
const { getAllExaminations, addExamination } = require("../controllers/examinationController");

const router = express.Router();

// Get all examinations
router.get("/", getAllExaminations);

// Add new examination
router.post("/", addExamination);

module.exports = router;
