const express = require("express");

const {
    getAllAttendance,
    addAttendance,
    getAttendance,
    getStudentsByCourse,
    bulkMarkAttendance
} = require("../controllers/attendanceController");

const router = express.Router();

router.get("/", getAllAttendance);
router.get("/course/students", getStudentsByCourse);  // Get students enrolled in a course
router.post("/bulk-mark", bulkMarkAttendance);        // Bulk mark attendance for multiple students
router.post("/", addAttendance);                       // Single attendance record
router.get("/:studentId", getAttendance);             // Get student's attendance


module.exports = router;