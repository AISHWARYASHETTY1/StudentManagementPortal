import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Payments = ({ admin, onLogout }) => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        studentId: "",
        amount: "",
        paymentMethod: "Online"
    });

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await fetch("http://localhost:5000/api/payments");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch payments");
            }

            setPayments(data || []);
        } catch (error) {
            console.error("Error fetching payments:", error);
            setError(error.message || "Failed to load payments");
        } finally {
            setLoading(false);
        }
    };

    const handleAddPayment = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/payments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    studentId: Number(formData.studentId),
                    amount: Number(formData.amount),
                    paymentMethod: formData.paymentMethod
                })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Payment could not be recorded");
            }

            setFormData({ studentId: "", amount: "", paymentMethod: "Online" });
            setShowForm(false);
            setError("");
            await fetchPayments();
        } catch (error) {
            console.error("Error adding payment:", error);
            setError(error.message || "Failed to record payment");
        }
    };

    const handleGoBack = () => {
        navigate("/dashboard");
    };

    return (
        <div className="legacy-admin-page" style={{ minHeight: "100vh", background: "var(--light)" }}>
            {/* Header */}
            <div style={{
                background: "white",
                padding: "20px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: "24px" }}>Payments Management</h1>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        onClick={handleGoBack}
                        style={{
                            padding: "10px 20px",
                            background: "var(--primary)",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}
                    >
                        Back to Dashboard
                    </button>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        style={{
                            padding: "10px 20px",
                            background: "var(--success)",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}
                    >
                        {showForm ? "Cancel" : "Add Payment"}
                    </button>
                    <button
                        onClick={onLogout}
                        style={{
                            padding: "10px 20px",
                            background: "var(--danger)",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer"
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: "30px 20px" }}>
                {error && (
                    <div style={{
                        background: "#fee",
                        border: "1px solid var(--danger)",
                        color: "var(--danger)",
                        padding: "12px",
                        borderRadius: "6px",
                        marginBottom: "20px"
                    }}>
                        {error}
                    </div>
                )}

                {showForm && (
                    <form onSubmit={handleAddPayment} style={{
                        background: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        border: "1px solid var(--border)"
                    }}>
                        <h3>Record Payment</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
                            <input
                                type="number"
                                placeholder="Student ID"
                                value={formData.studentId}
                                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                required
                                style={{
                                    padding: "10px",
                                    border: "1px solid var(--border)",
                                    borderRadius: "6px",
                                    fontSize: "14px"
                                }}
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                                style={{
                                    padding: "10px",
                                    border: "1px solid var(--border)",
                                    borderRadius: "6px",
                                    fontSize: "14px"
                                }}
                            />
                            <select
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                style={{
                                    padding: "10px",
                                    border: "1px solid var(--border)",
                                    borderRadius: "6px",
                                    fontSize: "14px"
                                }}
                            >
                                <option value="Online">Online</option>
                                <option value="Cheque">Cheque</option>
                                <option value="Cash">Cash</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            style={{
                                marginTop: "15px",
                                padding: "10px 20px",
                                background: "var(--success)",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "600"
                            }}
                        >
                            Record Payment
                        </button>
                    </form>
                )}

                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                        <p>Loading payments...</p>
                    </div>
                ) : (
                    <div style={{
                        background: "white",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        overflow: "hidden"
                    }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "var(--light)", borderBottom: "2px solid var(--border)" }}>
                                    <th style={{ padding: "15px", textAlign: "left" }}>Student ID</th>
                                    <th style={{ padding: "15px", textAlign: "left" }}>Amount</th>
                                    <th style={{ padding: "15px", textAlign: "left" }}>Payment Date</th>
                                    <th style={{ padding: "15px", textAlign: "left" }}>Method</th>
                                    <th style={{ padding: "15px", textAlign: "left" }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: "20px", textAlign: "center", color: "var(--text-light)" }}>
                                            No payments found
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((payment) => (
                                        <tr key={payment.PaymentId} style={{ borderBottom: "1px solid var(--border)" }}>
                                            <td style={{ padding: "15px" }}>{payment.StudentId}</td>
                                            <td style={{ padding: "15px" }}>₹{payment.Amount}</td>
                                            <td style={{ padding: "15px" }}>{payment.PaymentDate}</td>
                                            <td style={{ padding: "15px" }}>{payment.PaymentMethod || payment.Method}</td>
                                            <td style={{ padding: "15px", color: payment.Status === "Paid" ? "var(--success)" : "var(--text-light)", fontWeight: 700 }}>{payment.Status || "Recorded"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payments;
