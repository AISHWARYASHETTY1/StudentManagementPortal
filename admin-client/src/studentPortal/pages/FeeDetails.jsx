import { useEffect, useState } from "react";
import { getStudentData } from "../api/studentApi";

const feeData = [
    {
        category: "Tuition Fee",
        amount: 45000,
        paid: 45000,
        status: "Paid"
    },
    {
        category: "Examination Fee",
        amount: 2500,
        paid: 2500,
        status: "Paid"
    },
    {
        category: "Library Fee",
        amount: 1500,
        paid: 1500,
        status: "Paid"
    },
    {
        category: "Laboratory Fee",
        amount: 3000,
        paid: 2000,
        status: "Partial"
    },
    {
        category: "Other Charges",
        amount: 1000,
        paid: 1000,
        status: "Paid"
    }
];

const totalFee = feeData.reduce(
    (total, item) => total + item.amount,
    0
);

const totalPaid = feeData.reduce(
    (total, item) => total + item.paid,
    0
);

const totalDue = totalFee - totalPaid;


const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
};


const FeeDetails = () => {
    const [liveFees, setLiveFees] = useState([]);
    const [paymentMessage, setPaymentMessage] = useState("");
    const [payingFeeId, setPayingFeeId] = useState(null);
    const loadFees = () => {
        getStudentData("/fees").then(({ fees }) => setLiveFees(fees.map(fee => ({
            id: fee.FeeId, category: fee.FeeType || "Fee", amount: Number(fee.TotalAmount || 0), paid: Number(fee.PaidAmount || 0),
            pending: Number(fee.PendingAmount || 0), dueDate: fee.DueDate, status: fee.Status || "Pending"
        })))).catch(console.error);
    };
    useEffect(() => {
        loadFees();
    }, []);
    const payNow = async (feeId) => {
        try {
            setPayingFeeId(feeId);
            setPaymentMessage("");
            const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/student/payments/pay`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("studentToken")}` },
                body: JSON.stringify({ feeId })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Payment could not be completed");
            setPaymentMessage(`Payment successful. Transaction ${data.transactionId} is marked as paid.`);
            loadFees();
        } catch (error) {
            setPaymentMessage(error.message);
        } finally {
            setPayingFeeId(null);
        }
    };
    const feeData = liveFees;
    const totalFee = feeData.reduce((total, item) => total + item.amount, 0);
    const totalPaid = feeData.reduce((total, item) => total + item.paid, 0);
    const totalDue = totalFee - totalPaid;

    return (
        <main className="dashboard-content fees-page">

            {/* HEADER */}

            <div className="page-header">

                <div>

                    <h1>
                        Fee Details
                    </h1>

                    <p>
                        View your semester fee details and payment status
                    </p>

                </div>


                <select className="page-selector">

                    <option>
                        Semester 5
                    </option>

                    <option>
                        Semester 4
                    </option>

                </select>

            </div>


            {/* FEE SUMMARY */}

            <section className="fee-summary">

                <div className="fee-summary-card">

                    <div className="fee-summary-icon">
                        ₹
                    </div>

                    <div>

                        <span>
                            Total Fee
                        </span>

                        <strong>
                            {formatCurrency(totalFee)}
                        </strong>

                    </div>

                </div>


                <div className="fee-summary-card">

                    <div className="fee-summary-icon paid">
                        ✓
                    </div>

                    <div>

                        <span>
                            Amount Paid
                        </span>

                        <strong className="paid-text">
                            {formatCurrency(totalPaid)}
                        </strong>

                    </div>

                </div>


                <div className="fee-summary-card">

                    <div className="fee-summary-icon due">
                        !
                    </div>

                    <div>

                        <span>
                            Amount Due
                        </span>

                        <strong className="due-text">
                            {formatCurrency(totalDue)}
                        </strong>

                    </div>

                </div>


                <div className="fee-summary-card">

                    <div className="fee-summary-icon">
                        %
                    </div>

                    <div>

                        <span>
                            Payment Status
                        </span>

                        <strong className="paid-text">
                            {totalDue === 0 ? "Paid" : "Pending"}
                        </strong>

                    </div>

                </div>

            </section>


            {/* FEE DETAILS */}

            <section className="fees-card">

                <div className="fees-card-header">

                    <div>

                        <h3>
                            Semester Fee Details
                        </h3>

                        <p>
                            Breakdown of your current semester fees
                        </p>

                    </div>


                    <span className="fee-status-badge">
                        {totalDue === 0 ? "Fully Paid" : "Payment Due"}
                    </span>

                </div>
                {paymentMessage && <p className="course-request-message">{paymentMessage}</p>}


                <div className="fee-table">

                    <div className="fee-table-header">

                        <span>
                            FEE CATEGORY
                        </span>

                        <span>
                            TOTAL AMOUNT
                        </span>

                        <span>
                            PAID
                        </span>

                        <span>
                            BALANCE
                        </span>

                        <span>
                            STATUS
                        </span>

                    </div>


                    {feeData.map((fee) => {

                        const balance =
                            fee.amount - fee.paid;

                        return (

                            <div
                                className="fee-table-row"
                                key={fee.id || fee.category}
                            >

                                <div className="fee-category">

                                    <strong>
                                        {fee.category}
                                    </strong>

                                    <span>
                                        Semester 5
                                    </span>

                                </div>


                                <span className="fee-amount">
                                    {formatCurrency(fee.amount)}
                                </span>


                                <span className="fee-paid">
                                    {formatCurrency(fee.paid)}
                                </span>


                                <span className="fee-balance">
                                    {formatCurrency(balance)}
                                </span>


                                <span>

                                    <span
                                        className={
                                            fee.status === "Paid"
                                                ? "status-paid"
                                                : "status-partial"
                                        }
                                    >
                                        {fee.status}
                                    </span>
                                    {fee.status !== "Paid" && <button className="course-request-button pay-now-button" disabled={payingFeeId === fee.id} onClick={() => payNow(fee.id)}>{payingFeeId === fee.id ? "Processing..." : "Pay now"}</button>}

                                </span>

                            </div>

                        );

                    })}


                    {/* TOTAL */}

                    <div className="fee-total-row">

                        <strong>
                            Total
                        </strong>

                        <strong>
                            {formatCurrency(totalFee)}
                        </strong>

                        <strong className="paid-text">
                            {formatCurrency(totalPaid)}
                        </strong>

                        <strong className="due-text">
                            {formatCurrency(totalDue)}
                        </strong>

                        <strong className="paid-text">
                            {totalDue === 0 ? "Paid" : "Pending"}
                        </strong>

                    </div>

                </div>

            </section>


            {/* PAYMENT INFORMATION */}

            <section className="fee-bottom-grid">

                <div className="fee-info-card">

                    <div className="fee-info-icon">
                        📅
                    </div>

                    <div>

                        <h3>
                            Payment Due Date
                        </h3>

                        <p>
                            Last date for fee payment
                        </p>

                        <strong>
                            30 August 2026
                        </strong>

                    </div>

                </div>


                <div className="fee-info-card">

                    <div className="fee-info-icon">
                        💳
                    </div>

                    <div>

                        <h3>
                            Payment Options
                        </h3>

                        <p>
                            Online payment methods available
                        </p>

                        <strong>
                            UPI • Card • Net Banking
                        </strong>

                    </div>

                </div>

            </section>

        </main>
    );
};


export default FeeDetails;
