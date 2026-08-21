const { sql } = require("../config/db");

const getAllCourses = async (req, res) => {
    try {
        const result = await sql.query(`
            EXEC dbo.getAllCourses;
        `);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Get courses error:", error);
        res.status(500).json({ message: "Failed to fetch courses", error: error.message });
    }
};

const addCourse = async (req, res) => {
    try {
        const { courseCode, courseName, department, credits } = req.body;

        if (!courseCode || !courseName || !credits) {
            return res.status(400).json({
                success: false,
                message: "Course code, name, and credits are required"
            });
        }

        const request = new sql.Request();
        request.input("CourseCode", sql.VarChar(50), courseCode);
        request.input("CourseName", sql.VarChar(150), courseName);
        request.input("Department", sql.VarChar(100), department || null);
        request.input("Credits", sql.Int, credits);
        request.input("IsActive", sql.Bit, 1);

        const result = await request.query(`
            EXEC dbo.AddCourse
                @CourseCode = @CourseCode,
                @CourseName = @CourseName,
                @Department = @Department,
                @Credits = @Credits,
                @IsActive = @IsActive;
        `);

        const courseId = result.recordset[0].CourseId;

        res.status(201).json({
            success: true,
            message: "Course added successfully",
            course: {
                CourseId: courseId,
                CourseCode: courseCode,
                CourseName: courseName,
                Department: department,
                Credits: credits
            }
        });

    } catch (error) {
        console.error("Add course error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add course",
            error: error.message
        });
    }
};

const getEnrollmentRequests = async (req, res) => {
    try {
        const result = await sql.query(`
            EXEC dbo.getEnrollmentRequests;
        `);
        return res.status(200).json(result.recordset);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch enrollment requests" });
    }
};

const approveEnrollmentRequest = async (req, res) => {
    try {
        const studentCourseId = Number(req.params.studentCourseId);
        if (!Number.isInteger(studentCourseId) || studentCourseId <= 0) {
            return res.status(400).json({ message: "Invalid enrollment request" });
        }
        const request = new sql.Request();
        request.input("StudentCourseId", sql.Int, studentCourseId);
        const result = await request.query(`
            EXEC dbo.ActivateStudentCourse @StudentCourseId = @StudentCourseId;
        `);
        if (!result.recordset[0].Updated) return res.status(404).json({ message: "Pending enrollment request not found" });
        return res.status(200).json({ success: true, message: "Course enrollment approved" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to approve enrollment request" });
    }
};

module.exports = {
    getAllCourses,
    addCourse,
    getEnrollmentRequests,
    approveEnrollmentRequest
};
