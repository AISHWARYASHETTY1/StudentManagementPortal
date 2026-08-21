const express = require("express");

const {
    getStudents,
    addStudent,
    getCourses,
    getStudentCourses,
    getAttendance,
    getMarks,
    getAllMarks,
    addMark,
    bulkAddMarks
} = require("../controllers/studentController");

const router = express.Router();

router.get("/", getStudents);
router.post("/", addStudent);
router.get("/courses", getCourses);
router.get("/student-courses", getStudentCourses);
router.get("/attendance", getAttendance);
router.get("/marks", getAllMarks);
router.post("/marks/bulk", bulkAddMarks);
router.post("/marks", addMark);

module.exports = router;
