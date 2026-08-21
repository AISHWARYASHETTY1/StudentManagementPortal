const { sql } = require("../config/db");
const bcrypt = require("bcrypt");

const getStudents = async (req, res) => {
    try {
        const result = await sql.query`
            EXEC dbo.GetStudents;
        `;

        res.status(200).json(result.recordset);

    } catch (error) {
        console.error("Error fetching students:", error);

        res.status(500).json({
            message: "Failed to fetch students",
            error: error.message
        });
    }
};

const addStudent = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, department, course, yearOfStudy } = req.body;

        if (!firstName || !lastName || !email) {
            return res.status(400).json({
                success: false,
                message: "First name, last name, and email are required"
            });
        }

        const temporaryPasswordHash = await bcrypt.hash(process.env.DEV_STUDENT_PASSWORD || "Student@123", 12);
        const request = new sql.Request();
        request.input("FirstName", sql.VarChar(100), firstName);
        request.input("LastName", sql.VarChar(100), lastName);
        request.input("Email", sql.VarChar(150), email);
        request.input("Phone", sql.VarChar(25), phone || null);
        request.input("Department", sql.VarChar(100), department || null);
        request.input("Course", sql.VarChar(100), course || null);
        request.input("YearOfStudy", sql.Int, yearOfStudy || null);
        request.input("JoiningDate", sql.Date, new Date());
        request.input("IsActive", sql.Bit, 1);
        request.input("PasswordHash", sql.VarChar(255), temporaryPasswordHash);

        const result = await request.query(`
            EXEC dbo.CreateStudentWithLogin
                @FirstName = @FirstName,
                @LastName = @LastName,
                @Email = @Email,
                @Phone = @Phone,
                @Department = @Department,
                @Course = @Course,
                @YearOfStudy = @YearOfStudy,
                @JoiningDate = @JoiningDate,
                @IsActive = @IsActive,
                @PasswordHash = @PasswordHash;
        `);

        const studentId = result.recordset[0].StudentId;
        const studentCode = result.recordset[0].StudentCode;

        res.status(201).json({
            success: true,
            message: "Student added successfully",
            student: {
                StudentId: studentId,
                StudentCode: studentCode,
                FirstName: firstName,
                LastName: lastName,
                Email: email,
                Phone: phone,
                Department: department,
                Course: course
            }
        });

    } catch (error) {
        console.error("Add student error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add student",
            error: error.message
        });
    }
};

const getCourses = async (req, res) => {
    try {
        const result = await sql.query(`
            EXEC dbo.getCourses;
        `);

        res.status(200).json(result.recordset);

    } catch (error) {
        console.error("Error fetching courses:", error.message);

        res.status(500).json({
            message: "Failed to fetch courses"
        });
    }
};
const getStudentCourses = async (req, res) => {
    try {
        const result = await sql.query(`
           EXEC dbo.getStudentCourses;
        `);

        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(
            "Error fetching student courses:",
            error.message
        );

        res.status(500).json({
            message: "Failed to fetch student courses"
        });
    }
};
const getAttendance = async (req, res) => {
    try {
        const result = await sql.query(`
            EXEC dbo.getAttendance;
        `);

        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(
            "Error fetching attendance:",
            error.message
        );

        res.status(500).json({
            message: "Failed to fetch attendance"
        });
    }
};
const getMarks = async (req, res) => {
    try {
        const result = await sql.query(`
            EXEC dbo.getMarks;
        `);

        res.status(200).json(result.recordset);

    } catch (error) {
        console.error(
            "Error fetching marks:",
            error.message
        );

        res.status(500).json({
            message: "Failed to fetch marks"
        });
    }
};

const getAllMarks = async (req, res) => {
    try {
        const result = await sql.query(`
            EXEC dbo.getAllMarks;
        `);

        res.status(200).json(result.recordset || []);
    } catch (error) {
        console.error("Get all marks error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch marks",
            error: error.message
        });
    }
};

const addMark = async (req, res) => {
    try {
        const { studentId, courseId, marks, maxMarks, examType } = req.body;

        if (!studentId || !courseId || !marks || !maxMarks) {
            return res.status(400).json({
                success: false,
                message: "Student ID, course ID, marks, and max marks are required"
            });
        }

        const request = new sql.Request();
        request.input("StudentId", sql.Int, Number(studentId));
        request.input("CourseId", sql.Int, Number(courseId));
        request.input("ExamType", sql.VarChar(100), examType || "Exam");
        request.input("MarksObtained", sql.Decimal(5, 2), Number(marks));
        request.input("MaxMarks", sql.Decimal(5, 2), Number(maxMarks));
        request.input("ExamDate", sql.Date, new Date());

        const result = await request.query(`
            EXEC dbo.AddMark
                @StudentId = @StudentId,
                @CourseId = @CourseId,
                @ExamType = @ExamType,
                @MarksObtained = @MarksObtained,
                @MaxMarks = @MaxMarks,
                @ExamDate = @ExamDate;
        `);

        res.status(201).json({
            success: true,
            message: "Result added successfully",
            result: {
                MarkId: result.recordset[0].MarkId,
                StudentId: Number(studentId),
                CourseId: Number(courseId),
                ExamType: examType || "Exam",
                MarksObtained: Number(marks),
                MaxMarks: Number(maxMarks),
                ExamDate: new Date().toISOString().split("T")[0]
            }
        });
    } catch (error) {
        console.error("Add mark error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add result",
            error: error.message
        });
    }
};

// Add or update marks for every student enrolled in one course.
const bulkAddMarks = async (req, res) => {
    try {
        const { courseId, maxMarks, examType, examDate, results } = req.body;
        const normalizedCourseId = Number(courseId);
        const normalizedMaxMarks = Number(maxMarks);
        const normalizedExamType = String(examType || "Exam").trim();

        if (!Number.isInteger(normalizedCourseId) || normalizedCourseId <= 0 ||
            !Number.isFinite(normalizedMaxMarks) || normalizedMaxMarks <= 0 ||
            !Array.isArray(results) || results.length === 0) {
            return res.status(400).json({ success: false, message: "Course, maximum marks, and at least one student result are required" });
        }

        const dateValue = examDate ? new Date(examDate) : new Date();
        if (Number.isNaN(dateValue.getTime())) {
            return res.status(400).json({ success: false, message: "Invalid examination date" });
        }
        const dateOnly = new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate());

        for (const result of results) {
            const marks = Number(result.marks);
            if (!Number.isInteger(Number(result.studentId)) || Number(result.studentId) <= 0 ||
                !Number.isFinite(marks) || marks < 0 || marks > normalizedMaxMarks) {
                return res.status(400).json({ success: false, message: "Every student must have valid marks between 0 and the maximum marks" });
            }
        }

        const savedResults = [];
        const failedResults = [];
        for (const result of results) {
            try {
                const request = new sql.Request();
                request.input("StudentId", sql.Int, Number(result.studentId));
                request.input("CourseId", sql.Int, normalizedCourseId);
                request.input("ExamType", sql.VarChar(100), normalizedExamType);
                request.input("MarksObtained", sql.Decimal(7, 2), Number(result.marks));
                request.input("MaxMarks", sql.Decimal(7, 2), normalizedMaxMarks);
                request.input("ExamDate", sql.Date, dateOnly);

                const saved = await request.query(`
                    EXEC dbo.UpsertMark
                        @StudentId = @StudentId,
                        @CourseId = @CourseId,
                        @ExamType = @ExamType,
                        @MarksObtained = @MarksObtained,
                        @MaxMarks = @MaxMarks,
                        @ExamDate = @ExamDate;
                `);
                savedResults.push({ studentId: Number(result.studentId), marks: Number(result.marks), maxMarks: normalizedMaxMarks, markId: saved.recordset[0].MarkId });
            } catch (error) {
                failedResults.push({ studentId: Number(result.studentId), error: error.message });
            }
        }

        return res.status(201).json({ success: failedResults.length === 0, message: `Results saved for ${savedResults.length} student(s)`, savedResults, failedResults, totalResults: results.length });
    } catch (error) {
        console.error("Bulk add marks error:", error);
        return res.status(500).json({ success: false, message: "Failed to save bulk results", error: error.message });
    }
};

module.exports = {
    getStudents,
    addStudent,
    getCourses,
    getStudentCourses,
    getAttendance,
    getMarks,
    getAllMarks,
    addMark,
    bulkAddMarks
};
