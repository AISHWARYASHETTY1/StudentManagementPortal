const { sql } = require("../config/db");

const getMyProfile = async (req, res) => {
    try {
        const studentId = req.user?.studentId;

        if (!Number.isInteger(studentId) || studentId <= 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid authenticated student identity"
            });
        }

        const request = new sql.Request();
        request.input("StudentId", sql.Int, studentId);

        const result = await request.query(`
            EXEC dbo.getResult @StudentId = @StudentId;
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            student: result.recordset[0]
        });
    } catch (error) {
        console.error("Get student profile error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch student profile"
        });
    }
};

const getMyCourses = async (req, res) => {
    try {
        const studentId = req.user.studentId;
        const request = new sql.Request();
        request.input("StudentId", sql.Int, studentId);

        const result = await request.query(`
           EXEC dbo.getMyCourses @StudentId = @StudentId;
        `);

        return res.status(200).json({ success: true, courses: result.recordset });
    } catch (error) {
        console.error("Get student courses error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch courses" });
    }
};

const getCourseCatalog = async (req, res) => {
    try {
        const studentId = req.user.studentId;
        const request = new sql.Request();
        request.input("StudentId", sql.Int, studentId);
        const result = await request.query(`
           EXEC dbo.getCourseCatalog @StudentId = @StudentId;
        `);
        return res.status(200).json({ success: true, courses: result.recordset });
    } catch (error) {
        console.error("Get course catalog error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch course catalog" });
    }
};

const requestCourseEnrollment = async (req, res) => {
    try {
        const studentId = req.user.studentId;
        const courseId = Number(req.body.courseId);
        if (!Number.isInteger(courseId) || courseId <= 0) {
            return res.status(400).json({ success: false, message: "A valid course is required" });
        }
        const request = new sql.Request();
        request.input("StudentId", sql.Int, studentId);
        request.input("CourseId", sql.Int, courseId);
        const result = await request.query(`
            EXEC dbo.RequestCourseEnrollment
                @StudentId = @StudentId,
                @CourseId = @CourseId;
        `);
        return res.status(201).json({ success: true, message: "Enrollment request sent for admin approval", studentCourseId: result.recordset[0].StudentCourseId });
    } catch (error) {
        const isKnownError = [50001, 50002].includes(error.number);
        return res.status(isKnownError ? 409 : 500).json({ success: false, message: isKnownError ? error.message : "Failed to request course enrollment" });
    }
};

const getMyAttendance = async (req, res) => {
    try {
        const studentId = req.user.studentId;
        const request = new sql.Request();
        request.input("StudentId", sql.Int, studentId);

        const result = await request.query(`
            EXEC dbo.getMyAttendance @StudentId = @StudentId;
        `);

        const attendance = result.recordset;
        const totalClasses = attendance.length;
        const presentClasses = attendance.filter(record => record.Status?.toLowerCase() === "present").length;
        const absentClasses = attendance.filter(record => record.Status?.toLowerCase() === "absent").length;
        const lateClasses = attendance.filter(record => record.Status?.toLowerCase() === "late").length;
        const courseMap = attendance.reduce((courses, record) => {
            if (!courses[record.CourseId]) {
                courses[record.CourseId] = {
                    courseId: record.CourseId,
                    courseCode: record.CourseCode,
                    courseName: record.CourseName,
                    total: 0,
                    present: 0,
                    absent: 0,
                    late: 0
                };
            }

            const course = courses[record.CourseId];
            course.total += 1;
            if (record.Status?.toLowerCase() === "present") course.present += 1;
            if (record.Status?.toLowerCase() === "absent") course.absent += 1;
            if (record.Status?.toLowerCase() === "late") course.late += 1;
            return courses;
        }, {});
        const courseSummary = Object.values(courseMap).map(course => ({
            ...course,
            percentage: course.total ? Math.round((course.present / course.total) * 100) : 0
        }));

        return res.status(200).json({
            success: true,
            summary: {
                totalClasses,
                presentClasses,
                absentClasses,
                lateClasses,
                percentage: totalClasses ? Math.round((presentClasses / totalClasses) * 100) : 0
            },
            courseSummary,
            attendance
        });
    } catch (error) {
        console.error("Get student attendance error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch attendance" });
    }
};

const getMyResults = async (req, res) => {
    try {
        const studentId = req.user.studentId;
        const request = new sql.Request();
        request.input("StudentId", sql.Int, studentId);

        const result = await request.query(`
            EXEC dbo.getMyResults @StudentId = @StudentId;
        `);

        return res.status(200).json({ success: true, results: result.recordset });
    } catch (error) {
        console.error("Get student results error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch results" });
    }
};

const getMyFees = async (req, res) => {
    try {
        const studentId = req.user.studentId;
        const request = new sql.Request();
        request.input("StudentId", sql.Int, studentId);

        const result = await request.query(`
           EXEC dbo.getMyFees @StudentId = @StudentId;
        `);

        return res.status(200).json({ success: true, fees: result.recordset });
    } catch (error) {
        console.error("Get student fees error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch fees" });
    }
};

const getMyPayments = async (req, res) => {
    try {
        const studentId = req.user.studentId;
        const request = new sql.Request();
        request.input("StudentId", sql.Int, studentId);

        const result = await request.query(`
            EXEC dbo.getMyPayments @StudentId = @StudentId;
        `);

        return res.status(200).json({ success: true, payments: result.recordset });
    } catch (error) {
        console.error("Get student payments error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch payments" });
    }
};

const payMyFee = async (req, res) => {
    try {
        const studentId = req.user.studentId;
        const feeId = Number(req.body.feeId);
        if (!Number.isInteger(feeId) || feeId <= 0) {
            return res.status(400).json({ success: false, message: "A valid fee is required" });
        }
        const transactionId = `SP-${feeId}-${Date.now()}`;
        const request = new sql.Request();
        request.input("FeeId", sql.Int, feeId);
        request.input("StudentId", sql.Int, studentId);
        request.input("TransactionId", sql.VarChar(100), transactionId);
        await request.query(`
            EXEC dbo.PayStudentFee
                @FeeId = @FeeId,
                @StudentId = @StudentId,
                @TransactionId = @TransactionId;
        `);
        return res.status(201).json({ success: true, message: "Payment completed successfully", transactionId });
    } catch (error) {
        const statusCode = error.number === 50003 ? 404 : error.number === 50004 ? 409 : 500;
        const message = statusCode === 500 ? "Payment failed" : error.message;
        return res.status(statusCode).json({ success: false, message });
    }
};

const getMyTimetable = async (req, res) => {
    try {
        const studentId = req.user.studentId;
        const request = new sql.Request();
        request.input("StudentId", sql.Int, studentId);

        const result = await request.query(`
           EXEC dbo.[GetStudentTimetable] @StudentId = @StudentId;
        `);

        return res.status(200).json({ success: true, timetable: result.recordset });
    } catch (error) {
        console.error("Get student timetable error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch timetable" });
    }
};

const getMyExams = async (req, res) => {
    try {
        const studentId = req.user.studentId;
        const request = new sql.Request();
        request.input("StudentId", sql.Int, studentId);

        const result = await request.query(`
           EXEC dbo.[GetStudentExams] @StudentId = @StudentId;
        `);

        return res.status(200).json({ success: true, exams: result.recordset });
    } catch (error) {
        console.error("Get student exams error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch examinations" });
    }
};

const getMyDashboard = async (req, res) => {
    try {
        const studentId = req.user.studentId;
        const attendanceRequest = new sql.Request();
        attendanceRequest.input("StudentId", sql.Int, studentId);
        const attendanceResult = await attendanceRequest.query(`
            EXEC dbo.[GetStudentAttendanceSummary] @StudentId = @StudentId;
        `);

        const coursesRequest = new sql.Request();
        coursesRequest.input("StudentId", sql.Int, studentId);
        const coursesResult = await coursesRequest.query(`
            EXEC dbo.[GetStudentActiveCourses]  @StudentId = @StudentId;
        `);

        const marksRequest = new sql.Request();
        marksRequest.input("StudentId", sql.Int, studentId);
        const marksResult = await marksRequest.query(`
            EXEC dbo.[GetStudentMarksByStudentId] @StudentId = @StudentId;
        `);

        const summaryRequest = new sql.Request();
        summaryRequest.input("StudentId", sql.Int, studentId);
        const marksSummary = await summaryRequest.query(`
            EXEC dbo.GetStudentMarksSummary @StudentId = @StudentId;
        `);

        const totalClasses = Number(attendanceResult.recordset[0].TotalClasses || 0);
        const presentClasses = Number(attendanceResult.recordset[0].PresentClasses || 0);
        const totalMarksObtained = Number(marksSummary.recordset[0].TotalMarksObtained || 0);
        const totalMaxMarks = Number(marksSummary.recordset[0].TotalMaxMarks || 0);
        const courses = coursesResult.recordset;

        return res.status(200).json({
            success: true,
            summary: {
                attendance: totalClasses ? Number(((presentClasses / totalClasses) * 100).toFixed(1)) : 0,
                academicPerformance: totalMaxMarks ? Number(((totalMarksObtained / totalMaxMarks) * 100).toFixed(1)) : 0,
                totalCredits: courses.reduce((total, course) => total + Number(course.Credits || 0), 0),
                totalCourses: courses.length
            },
            attendance: {
                totalClasses,
                presentClasses,
                percentage: totalClasses ? Number(((presentClasses / totalClasses) * 100).toFixed(1)) : 0
            },
            courses,
            marks: marksResult.recordset
        });
    } catch (error) {
        console.error("Get student dashboard error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch dashboard data" });
    }
};

module.exports = {
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
};
