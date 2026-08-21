import { useNavigate } from "react-router-dom";

const StudentDashboard = ({ student, onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (onLogout) onLogout();
        navigate("/login");
    };

    return (
        <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                <div>
                    <p style={{ margin: 0, color: "#667085", textTransform: "uppercase", letterSpacing: "1px", fontSize: "12px" }}>Overview</p>
                    <h1 style={{ margin: "8px 0 0" }}>Student Dashboard</h1>
                    <p style={{ margin: "8px 0 0", color: "#475467" }}>Welcome, {student?.FirstName || "Student"} {student?.LastName || ""}</p>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        background: "#0f172a",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        padding: "10px 18px",
                        cursor: "pointer",
                        fontWeight: 600
                    }}
                >
                    Logout
                </button>
            </header>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "20px" }}>
                    <p style={{ margin: 0, color: "#667085" }}>Student Code</p>
                    <h3 style={{ margin: "12px 0 0" }}>{student?.StudentCode || "N/A"}</h3>
                </div>
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "20px" }}>
                    <p style={{ margin: 0, color: "#667085" }}>Department</p>
                    <h3 style={{ margin: "12px 0 0" }}>{student?.Department || "N/A"}</h3>
                </div>
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "20px" }}>
                    <p style={{ margin: 0, color: "#667085" }}>Course</p>
                    <h3 style={{ margin: "12px 0 0" }}>{student?.Course || "N/A"}</h3>
                </div>
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "20px" }}>
                    <p style={{ margin: 0, color: "#667085" }}>Email</p>
                    <h3 style={{ margin: "12px 0 0", fontSize: "16px" }}>{student?.Email || "N/A"}</h3>
                </div>
            </div>

            <div style={{ marginTop: "28px", background: "#0f172a", color: "#fff", borderRadius: "16px", padding: "22px" }}>
                <h2 style={{ marginTop: 0 }}>Student access</h2>
                <p style={{ marginBottom: 0 }}>You are now signed in through the integrated portal and can continue using the student dashboard without leaving the admin login app.</p>
            </div>
        </div>
    );
};

export default StudentDashboard;
