const express = require("express");
const { getAllCourses, addCourse, getEnrollmentRequests, approveEnrollmentRequest } = require("../controllers/courseController");

const router = express.Router();

// Get all courses
router.get("/", getAllCourses);

// Add new course
router.post("/", addCourse);
router.get("/enrollment-requests", getEnrollmentRequests);
router.put("/enrollment-requests/:studentCourseId/approve", approveEnrollmentRequest);

module.exports = router;
