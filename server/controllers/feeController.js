const { sql } = require("../config/db");

const getAllFees = async (req, res) => {
    try {
        const result = await sql.query(`
           EXEC dbo.getAllFees;
        `);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Get fees error:", error);
        res.status(500).json({ message: "Failed to fetch fees", error: error.message });
    }
};

const addFee = async (req, res) => {
    try {
        const { studentId, amount, dueDate, academicYear, semester, feeType } = req.body;

        if (!studentId || !amount || !dueDate) {
            return res.status(400).json({
                success: false,
                message: "Student ID, amount, and due date are required"
            });
        }

        const request = new sql.Request();
        request.input("StudentId", sql.Int, studentId);
        request.input("AcademicYear", sql.VarChar(50), academicYear || "2025-2026");
        request.input("Semester", sql.VarChar(50), semester || "Semester 1");
        request.input("FeeType", sql.VarChar(100), feeType || "Tuition");
        request.input("TotalAmount", sql.Decimal(10, 2), amount);
        request.input("PaidAmount", sql.Decimal(10, 2), 0);
        request.input("PendingAmount", sql.Decimal(10, 2), amount);
        request.input("DueDate", sql.Date, dueDate);
        request.input("Status", sql.VarChar(50), "Pending");

        const result = await request.query(`
            EXEC dbo.AddFee
                @StudentId = @StudentId,
                @AcademicYear = @AcademicYear,
                @Semester = @Semester,
                @FeeType = @FeeType,
                @TotalAmount = @TotalAmount,
                @PaidAmount = @PaidAmount,
                @PendingAmount = @PendingAmount,
                @DueDate = @DueDate,
                @Status = @Status;
        `);

        const feeId = result.recordset[0].FeeId;

        res.status(201).json({
            success: true,
            message: "Fee added successfully",
            fee: {
                FeeId: feeId,
                StudentId: studentId,
                Amount: amount,
                DueDate: dueDate,
                Status: "Pending"
            }
        });

    } catch (error) {
        console.error("Add fee error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add fee",
            error: error.message
        });
    }
};

const updateFeeStatus = async (req, res) => {
    try {
        const { feeId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        const request = new sql.Request();
        request.input("FeeId", sql.Int, feeId);
        request.input("Status", sql.VarChar(50), status);

        await request.query(`
            EXEC dbo.UpdateFeeStatus
                @FeeId = @FeeId,
                @Status = @Status;
        `);

        res.status(200).json({
            success: true,
            message: "Fee status updated successfully"
        });

    } catch (error) {
        console.error("Update fee error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update fee",
            error: error.message
        });
    }
};

module.exports = {
    getAllFees,
    addFee,
    updateFeeStatus
};
