const { sql } = require("../config/db");

const getAllAttendance = async (req, res) => {
    try {
        const result = await sql.query(`
            EXEC dbo.getAllAttendance;
        `);

        res.status(200).json(result.recordset || []);
    } catch (error) {
        console.error("Get all attendance error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch attendance",
            error: error.message
        });
    }
};

const addAttendance = async (req, res) => {
    try {
        const { studentId, courseId, status, attendanceDate } = req.body;

        const normalizedStatus = String(status || "").trim();
        if (!studentId || !courseId || !["Present", "Absent", "Late"].includes(normalizedStatus)) {
            return res.status(400).json({
                success: false,
                message: "Student ID, course ID, and a valid status (Present, Absent, or Late) are required"
            });
        }

        const request = new sql.Request();
        request.input("StudentId", sql.Int, Number(studentId));
        request.input("CourseId", sql.Int, Number(courseId));
        const classDateTime = attendanceDate ? new Date(attendanceDate) : new Date();
        if (Number.isNaN(classDateTime.getTime())) {
            return res.status(400).json({ success: false, message: "Invalid attendance date and time" });
        }

        request.input("AttendanceDate", sql.DateTime2, classDateTime);
        request.input("Status", sql.VarChar(50), normalizedStatus);

        const result = await request.query(`
           EXEC dbo.AddAttendance
           @StudentId = @StudentId,
           @CourseId = @CourseId,
           @AttendanceDate = @AttendanceDate,
           @Status = @Status;
        `);

        res.status(201).json({
            success: true,
            message: "Attendance marked successfully",
            record: {
                AttendanceId: result.recordset[0].AttendanceId,
                StudentId: Number(studentId),
                CourseId: Number(courseId),
                AttendanceDate: classDateTime.toISOString(),
                Status: normalizedStatus
            }
        });
    } catch (error) {
        console.error("Add attendance error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark attendance",
            error: error.message
        });
    }
};

const getAttendance = async (req, res) => {
    try {
        const studentId = Number(req.params.studentId);

        if (!Number.isInteger(studentId) || studentId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        const request = new sql.Request();
        request.input("StudentId", sql.Int, studentId);

        const result = await request.query(`
            EXEC dbo.getAttendanceByStudentId @StudentId = @StudentId;
        `);

        const attendanceRecords = result.recordset;

        if (!attendanceRecords || attendanceRecords.length === 0) {
            return res.status(200).json({
                success: true,
                summary: {
                    totalClasses: 0,
                    presentClasses: 0,
                    absentClasses: 0,
                    lateClasses: 0,
                    percentage: 0
                },
                courseSummary: [],
                attendance: []
            });
        }

        const totalClasses = attendanceRecords.length;
        const presentClasses = attendanceRecords.filter(
            r => r.Status?.toLowerCase() === "present"
        ).length;
        const absentClasses = attendanceRecords.filter(
            r => r.Status?.toLowerCase() === "absent"
        ).length;
        const lateClasses = attendanceRecords.filter(
            r => r.Status?.toLowerCase() === "late"
        ).length;
        const percentage = totalClasses > 0
            ? Math.round((presentClasses / totalClasses) * 100)
            : 0;

        const courseMap = {};
        attendanceRecords.forEach(record => {
            const courseId = record.CourseId;
            if (!courseMap[courseId]) {
                courseMap[courseId] = {
                    courseId: courseId,
                    courseCode: record.CourseCode || `Course ${courseId}`,
                    courseName: record.CourseName || "Course",
                    total: 0,
                    present: 0,
                    absent: 0,
                    late: 0
                };
            }
            courseMap[courseId].total++;
            if (record.Status?.toLowerCase() === "present") {
                courseMap[courseId].present++;
            } else if (record.Status?.toLowerCase() === "absent") {
                courseMap[courseId].absent++;
            } else if (record.Status?.toLowerCase() === "late") {
                courseMap[courseId].late++;
            }
        });

        const courseSummary = Object.values(courseMap).map(course => ({
            ...course,
            percentage: course.total > 0
                ? Math.round((course.present / course.total) * 100)
                : 0
        }));

        return res.status(200).json({
            success: true,
            summary: {
                totalClasses,
                presentClasses,
                absentClasses,
                lateClasses,
                percentage
            },
            courseSummary,
            attendance: attendanceRecords
        });

    } catch (error) {
        console.error("Attendance error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch attendance",
            error: error.message
        });
    }
};

// Get all students enrolled in a specific course
const getStudentsByCourse = async (req, res) => {
    try {
        const { courseId } = req.query;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required"
            });
        }

        const request = new sql.Request();
        request.input("CourseId", sql.Int, Number(courseId));

        const result = await request.query(`
            EXEC dbo.getStudentsByCourse @CourseId = @CourseId;
        `);

        res.status(200).json({
            success: true,
            students: result.recordset || []
        });

    } catch (error) {
        console.error("Get students by course error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch enrolled students",
            error: error.message
        });
    }
};

// Bulk mark attendance for multiple students in one request
const bulkMarkAttendance = async (req, res) => {
    try {
        const { courseId, attendanceRecords, attendanceDate } = req.body;
        const normalizedCourseId = Number(courseId);
        const validStatuses = new Set(["Present", "Absent", "Late"]);

        if (!Number.isInteger(normalizedCourseId) || normalizedCourseId <= 0 || !Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Course ID and attendance records array are required"
            });
        }

        // Validate all records have required fields
        for (const record of attendanceRecords) {
            if (!Number.isInteger(Number(record.studentId)) || Number(record.studentId) <= 0 || !validStatuses.has(record.status)) {
                return res.status(400).json({
                    success: false,
                    message: "Each attendance record must have a valid studentId and status (Present, Absent, or Late)"
                });
            }
        }

        if (!attendanceDate) {
            return res.status(400).json({ success: false, message: "Class date and time are required" });
        }

        const dateValue = new Date(attendanceDate);
        if (Number.isNaN(dateValue.getTime())) {
            return res.status(400).json({ success: false, message: "Invalid class date and time" });
        }

        const successRecords = [];
        const failedRecords = [];

        // Upsert one row per student/course/class session. This makes retries
        // safe while allowing multiple classes for the same course on one day.
        for (const record of attendanceRecords) {
            try {
                const request = new sql.Request();
                request.input("StudentId", sql.Int, Number(record.studentId));
                request.input("CourseId", sql.Int, normalizedCourseId);
                request.input("AttendanceDate", sql.DateTime2, dateValue);
                request.input("Status", sql.VarChar(50), record.status.trim());

                const result = await request.query(`
                    EXEC dbo.UpsertAttendance
                        @StudentId = @StudentId,
                        @CourseId = @CourseId,
                        @AttendanceDate = @AttendanceDate,
                        @Status = @Status;
                `);

                successRecords.push({
                    studentId: record.studentId,
                    status: record.status.trim(),
                    attendanceId: result.recordset[0].AttendanceId
                });
            } catch (error) {
                failedRecords.push({
                    studentId: record.studentId,
                    error: error.message
                });
            }
        }

        res.status(201).json({
            success: true,
            message: `Attendance marked for ${successRecords.length} student(s)`,
            successRecords,
            failedRecords,
            totalRecords: attendanceRecords.length
        });

    } catch (error) {
        console.error("Bulk mark attendance error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark bulk attendance",
            error: error.message
        });
    }
};

module.exports = {
    getAllAttendance,
    addAttendance,
    getAttendance,
    getStudentsByCourse,
    bulkMarkAttendance
};
