const express = require("express");
const cors = require("cors");

const { sql, connectDB } = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const feeRoutes = require("./routes/feeRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const examinationRoutes = require("./routes/examinationRoutes");
const studentPortalRoutes = require("./routes/studentPortalRoutes");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/examinations", examinationRoutes);
app.use("/api/student", studentPortalRoutes);

app.get("/", (req, res) => {
    res.send("Student Portal API is running");
});

const PORT = 5000;

app.get("/api/debug/tables", async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT
                TABLE_NAME,
                COLUMN_NAME,
                DATA_TYPE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME IN (
                'Attendance',
                'Courses',
                'StudentCourses',
                'Marks'
            )
            ORDER BY TABLE_NAME, ORDINAL_POSITION
        `);

        res.json(result.recordset);

    } catch (error) {
        console.error("Table structure error:", error.message);

        res.status(500).json({
            message: "Failed to read table structure"
        });
    }
});

const startServer = async () => {
    try {
        await connectDB();

        const result = await sql.query(
            "SELECT DB_NAME() AS DatabaseName"
        );

        console.log(
            "📚 Connected database:",
            result.recordset[0].DatabaseName
        );

    } catch (error) {
        console.error("Startup failed:", error.message);
    } finally {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
};

startServer();
