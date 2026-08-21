const { sql } = require("../config/db");

const getAllPayments = async (req, res) => {
    try {
        const result = await sql.query(`
            EXEC dbo.getAllPayments;
        `);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Get payments error:", error);
        res.status(500).json({ message: "Failed to fetch payments", error: error.message });
    }
};

const addPayment = async (req, res) => {
    try {
        const { studentId, amount, paymentMethod } = req.body;

        if (!studentId || !amount || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Student ID, amount, and payment method are required"
            });
        }

        const request = new sql.Request();
        request.input("StudentId", sql.Int, studentId);
        request.input("Amount", sql.Decimal(10, 2), amount);
        request.input("PaymentMethod", sql.VarChar(50), paymentMethod);

        const result = await request.query(`
            EXEC dbo.RecordAdminPayment
                @StudentId = @StudentId,
                @Amount = @Amount,
                @PaymentMethod = @PaymentMethod;
        `);

        const paymentId = result.recordset[0].PaymentId;

        res.status(201).json({
            success: true,
            message: "Payment recorded successfully",
            payment: {
                PaymentId: paymentId,
                StudentId: studentId,
                Amount: amount,
                PaymentMethod: paymentMethod,
                PaymentDate: new Date()
            }
        });

    } catch (error) {
        console.error("Add payment error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to record payment",
            error: error.message
        });
    }
};

module.exports = {
    getAllPayments,
    addPayment
};
