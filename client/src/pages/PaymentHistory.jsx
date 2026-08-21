import { useEffect, useState } from "react";
import { getStudentData } from "../api/studentApi";

const paymentData = [
    {
        id: "PAY-2026-001",
        date: "05 Aug 2026",
        category: "Tuition Fee",
        amount: 45000,
        method: "UPI",
        status: "Successful"
    },
    {
        id: "PAY-2026-002",
        date: "03 Aug 2026",
        category: "Examination Fee",
        amount: 2500,
        method: "Debit Card",
        status: "Successful"
    },
    {
        id: "PAY-2026-003",
        date: "28 Jul 2026",
        category: "Library Fee",
        amount: 1500,
        method: "Net Banking",
        status: "Successful"
    },
    {
        id: "PAY-2026-004",
        date: "25 Jul 2026",
        category: "Laboratory Fee",
        amount: 2000,
        method: "UPI",
        status: "Successful"
    }
];


const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
};


const totalPaid = paymentData.reduce(
    (total, payment) => total + payment.amount,
    0
);


const PaymentHistory = () => {
    const [livePayments, setLivePayments] = useState([]);
    useEffect(() => {
        getStudentData("/payments").then(({ payments }) => setLivePayments(payments.map(payment => ({
            id: payment.TransactionId || `PAY-${payment.PaymentId}`, date: new Date(payment.PaymentDate).toLocaleDateString("en-IN"),
            category: payment.FeeType || "Fee Payment", amount: Number(payment.Amount || 0), method: payment.PaymentMethod || "-", status: payment.Status || "Successful"
        })))).catch(console.error);
    }, []);
    const paymentData = livePayments;
    const totalPaid = paymentData.reduce((total, payment) => total + payment.amount, 0);

    return (
        <main className="dashboard-content payments-page">

            {/* HEADER */}

            <div className="page-header">

                <div>

                    <h1>
                        Payment History
                    </h1>

                    <p>
                        View your previous fee payments and transactions
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


            {/* SUMMARY */}

            <section className="payment-summary">

                <div className="payment-summary-card">

                    <div className="payment-summary-icon">
                        ₹
                    </div>

                    <div>

                        <span>
                            Total Paid
                        </span>

                        <strong>
                            {formatCurrency(totalPaid)}
                        </strong>

                    </div>

                </div>


                <div className="payment-summary-card">

                    <div className="payment-summary-icon success">
                        ✓
                    </div>

                    <div>

                        <span>
                            Successful Payments
                        </span>

                        <strong>
                            {paymentData.length}
                        </strong>

                    </div>

                </div>


                <div className="payment-summary-card">

                    <div className="payment-summary-icon">
                        📅
                    </div>

                    <div>

                        <span>
                            Last Payment
                        </span>

                        <strong>
                            05 Aug 2026
                        </strong>

                    </div>

                </div>


                <div className="payment-summary-card">

                    <div className="payment-summary-icon success">
                        ✓
                    </div>

                    <div>

                        <span>
                            Payment Status
                        </span>

                        <strong className="payment-success-text">
                            Up to Date
                        </strong>

                    </div>

                </div>

            </section>


            {/* PAYMENT TABLE */}

            <section className="payments-card">

                <div className="payments-card-header">

                    <div>

                        <h3>
                            Transaction History
                        </h3>

                        <p>
                            Recent payments made towards your college fees
                        </p>

                    </div>


                    <span className="transaction-count">
                        {paymentData.length} Transactions
                    </span>

                </div>


                <div className="payment-table">

                    <div className="payment-table-header">

                        <span>
                            TRANSACTION ID
                        </span>

                        <span>
                            DATE
                        </span>

                        <span>
                            FEE CATEGORY
                        </span>

                        <span>
                            PAYMENT METHOD
                        </span>

                        <span>
                            AMOUNT
                        </span>

                        <span>
                            STATUS
                        </span>

                    </div>


                    {paymentData.map((payment) => (

                        <div
                            className="payment-table-row"
                            key={payment.id}
                        >

                            <strong className="transaction-id">
                                {payment.id}
                            </strong>


                            <span>
                                {payment.date}
                            </span>


                            <span className="payment-category">
                                {payment.category}
                            </span>


                            <span>
                                {payment.method}
                            </span>


                            <strong className="payment-amount">
                                {formatCurrency(payment.amount)}
                            </strong>


                            <span>

                                <span className="payment-success">
                                    <span className="payment-dot"></span>
                                    {payment.status}
                                </span>

                            </span>

                        </div>

                    ))}

                </div>

            </section>


            {/* RECEIPT INFORMATION */}

            <section className="payment-info-grid">

                <div className="payment-info-card">

                    <div className="payment-info-icon">
                        🧾
                    </div>

                    <div>

                        <h3>
                            Need a Receipt?
                        </h3>

                        <p>
                            Payment receipts are available for every successful transaction.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="receipt-btn"
                    >
                        View Receipts
                    </button>

                </div>


                <div className="payment-info-card">

                    <div className="payment-info-icon">
                        🔒
                    </div>

                    <div>

                        <h3>
                            Secure Payments
                        </h3>

                        <p>
                            All your payment transactions are securely recorded.
                        </p>

                    </div>

                </div>

            </section>

        </main>
    );
};


export default PaymentHistory;
