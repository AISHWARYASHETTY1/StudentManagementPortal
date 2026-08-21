const express = require("express");
const { requireStudent } = require("../middleware/authMiddleware");
const {
    getMyProfile,
    getMyCourses,
    getCourseCatalog,
    requestCourseEnrollment,
    getMyAttendance,
    getMyResults,
    getMyFees,
    getMyPayments,
    payMyFee,
    getMyTimetable,
    getMyExams,
    getMyDashboard
} = require("../controllers/studentPortalController");

const router = express.Router();

router.get("/profile", ...requireStudent, getMyProfile);
router.get("/courses", ...requireStudent, getMyCourses);
router.get("/course-catalog", ...requireStudent, getCourseCatalog);
router.post("/course-requests", ...requireStudent, requestCourseEnrollment);
router.get("/attendance", ...requireStudent, getMyAttendance);
router.get("/results", ...requireStudent, getMyResults);
router.get("/fees", ...requireStudent, getMyFees);
router.get("/payments", ...requireStudent, getMyPayments);
router.post("/payments/pay", ...requireStudent, payMyFee);
router.get("/timetable", ...requireStudent, getMyTimetable);
router.get("/exams", ...requireStudent, getMyExams);
router.get("/dashboard", ...requireStudent, getMyDashboard);

module.exports = router;
