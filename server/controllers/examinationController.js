const { sql } = require("../config/db");

const getAllExaminations = async (req, res) => {
    try {
        const result = await sql.query(`
            EXEC dbo.getAllExaminations;
        `);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Get examinations error:", error);
        res.status(500).json({ message: "Failed to fetch examinations", error: error.message });
    }
};

const addExamination = async (req, res) => {
    try {
        const { courseId, examName, examDate, time, venue } = req.body;
        const normalizedCourseId = Number(courseId);
        const normalizedExamName = String(examName || "").trim();
        const normalizedTime = String(time || "").trim();

        if (!Number.isInteger(normalizedCourseId) || normalizedCourseId <= 0 || !normalizedExamName || !examDate || !normalizedTime) {
            return res.status(400).json({
                success: false,
                message: "Course ID, exam name, date, and time are required"
            });
        }

        const timeMatch = normalizedTime.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
        const hours = Number(timeMatch?.[1]);
        const minutes = Number(timeMatch?.[2]);
        const seconds = Number(timeMatch?.[3] || 0);
        if (!timeMatch || hours > 23 || minutes > 59 || seconds > 59) {
            return res.status(400).json({ success: false, message: "Exam time must be a valid 24-hour time" });
        }
        const examDateValue = new Date(examDate);
        if (Number.isNaN(examDateValue.getTime())) {
            return res.status(400).json({ success: false, message: "Exam date must be valid" });
        }
        // mssql's sql.Time parameter expects a Date/time value, not the
        // browser's HH:mm string.
        const examTime = new Date(1970, 0, 1, hours, minutes, seconds);

        const request = new sql.Request();
        request.input("CourseId", sql.Int, normalizedCourseId);
        request.input("ExamType", sql.VarChar(50), normalizedExamName);
        request.input("ExamDate", sql.Date, examDateValue);
        request.input("ExamTime", sql.Time, examTime);
        request.input("Venue", sql.VarChar(100), String(venue || "Main Hall").trim());
        request.input("IsActive", sql.Bit, 1);

        const result = await request.query(`
            EXEC dbo.AddExamination
                @CourseId = @CourseId,
                @ExamType = @ExamType,
                @ExamDate = @ExamDate,
                @ExamTime = @ExamTime,
                @Venue = @Venue,
                @IsActive = @IsActive;
        `);

        const examId = result.recordset[0].ExamId;

        res.status(201).json({
            success: true,
            message: "Examination added successfully",
            exam: {
                ExamId: examId,
                CourseId: normalizedCourseId,
                ExamName: normalizedExamName,
                ExamDate: examDate,
                ExamTime: time
            }
        });

    } catch (error) {
        console.error("Add examination error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add examination",
            error: error.message
        });
    }
};

module.exports = {
    getAllExaminations,
    addExamination
};
