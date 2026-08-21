import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Fees = ({ admin, onLogout }) => {
    const navigate = useNavigate();
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        studentId: "",
        amount: "",
        dueDate: ""
    });

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await fetch("http://localhost:5000/api/fees");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch fees");
            }

            setFees(data || []);
        } catch (error) {
            console.error("Error fetching fees:", error);
            setError(error.message || "Failed to load fees");
        } finally {
            setLoading(false);
        }
    };

    const handleAddFee = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/fees", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    studentId: Number(formData.studentId),
                    amount: Number(formData.amount),
                    dueDate: formData.dueDate
                })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Fee could not be added");
            }

            setFormData({ studentId: "", amount: "", dueDate: "" });
            setShowForm(false);
            setError("");
            await fetchFees();
        } catch (error) {
            console.error("Error adding fee:", error);
            setError(error.message || "Failed to add fee");
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
                    <h1 style={{ margin: 0, fontSize: "24px" }}>Fees Management</h1>
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
                        {showForm ? "Cancel" : "Add Fee"}
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
                    <form onSubmit={handleAddFee} style={{
                        background: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        border: "1px solid var(--border)"
                    }}>
                        <h3>Add Fee</h3>
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
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                required
                                style={{
                                    padding: "10px",
                                    border: "1px solid var(--border)",
                                    borderRadius: "6px",
                                    fontSize: "14px"
                                }}
                            />
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
                            Add Fee
                        </button>
                    </form>
                )}

                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                        <p>Loading fees...</p>
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
                                    <th style={{ padding: "15px", textAlign: "left" }}>Due Date</th>
                                    <th style={{ padding: "15px", textAlign: "left" }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fees.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ padding: "20px", textAlign: "center", color: "var(--text-light)" }}>
                                            No fees found
                                        </td>
                                    </tr>
                                ) : (
                                    fees.map((fee) => (
                                        <tr key={fee.FeeId} style={{ borderBottom: "1px solid var(--border)" }}>
                                            <td style={{ padding: "15px" }}>{fee.StudentId}</td>
                                            <td style={{ padding: "15px" }}>₹{fee.Amount}</td>
                                            <td style={{ padding: "15px" }}>{fee.DueDate}</td>
                                            <td style={{ padding: "15px" }}>
                                                <span style={{
                                                    padding: "4px 8px",
                                                    borderRadius: "4px",
                                                    background: fee.Status === "Paid" ? "#e0ffe0" : "#ffe0e0",
                                                    color: fee.Status === "Paid" ? "#006600" : "#cc0000"
                                                }}>
                                                    {fee.Status}
                                                </span>
                                            </td>
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

export default Fees;
