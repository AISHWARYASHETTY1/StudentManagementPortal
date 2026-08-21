const { sql } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

const loginStudent = async (req, res) => {
    try {
        const studentCode = String(req.body.studentCode || "").trim();
        const password = String(req.body.password || "").trim();

        if (!studentCode || !password) {
            return res.status(400).json({
                success: false,
                message: "Student code and password are required"
            });
        }

        const request = new sql.Request();
        request.input("StudentCode", sql.VarChar, studentCode);

        const result = await request.query(`

            EXEC dbo.[loginStudent] @StudentCode = @StudentCode;

            
        `);

        if (result.recordset.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid student code or password"
            });
        }

        const student = result.recordset[0];
        const isPasswordValid = await bcrypt.compare(password, student.PasswordHash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid student code or password"
            });
        }

        const token = jwt.sign(
            {
                userId: student.StudentUserId,
                studentId: student.StudentId,
                studentCode: student.StudentCode,
                role: "student"
            },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        delete student.PasswordHash;
        delete student.StudentUserId;

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            student: student
        });

    } catch (error) {

        console.error("❌ Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
};

module.exports = {
    loginStudent
};