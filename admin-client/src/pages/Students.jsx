import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Students = ({ admin, onLogout }) => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        course: "",
        yearOfStudy: ""
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:5000/api/students");
            const data = await response.json();
            setStudents(data || []);
        } catch (error) {
            console.error("Error fetching students:", error);
            setError("Failed to load students");
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    department: formData.department,
                    course: formData.course,
                    yearOfStudy: formData.yearOfStudy ? Number(formData.yearOfStudy) : null
                })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Student could not be added");
            }

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                department: "",
                course: "",
                yearOfStudy: ""
            });
            setShowForm(false);
            setError("");
            await fetchStudents();
        } catch (error) {
            console.error("Error adding student:", error);
            setError(error.message || "Failed to add student");
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
                    <h1 style={{ margin: 0, fontSize: "24px" }}>Students Management</h1>
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
                        {showForm ? "Cancel" : "Add Student"}
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
                    <form onSubmit={handleAddStudent} style={{
                        background: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        border: "1px solid var(--border)"
                    }}>
                        <h3>Add New Student</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                                style={{
                                    padding: "10px",
                                    border: "1px solid var(--border)",
                                    borderRadius: "6px",
                                    fontSize: "14px"
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                                style={{
                                    padding: "10px",
                                    border: "1px solid var(--border)",
                                    borderRadius: "6px",
                                    fontSize: "14px"
                                }}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                style={{
                                    padding: "10px",
                                    border: "1px solid var(--border)",
                                    borderRadius: "6px",
                                    fontSize: "14px"
                                }}
                            />
                            <input
                                type="tel"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                style={{
                                    padding: "10px",
                                    border: "1px solid var(--border)",
                                    borderRadius: "6px",
                                    fontSize: "14px"
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Department"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                style={{
                                    padding: "10px",
                                    border: "1px solid var(--border)",
                                    borderRadius: "6px",
                                    fontSize: "14px"
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Course"
                                value={formData.course}
                                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                style={{
                                    padding: "10px",
                                    border: "1px solid var(--border)",
                                    borderRadius: "6px",
                                    fontSize: "14px"
                                }}
                            />
                            <input
                                type="number"
                                placeholder="Year of Study"
                                value={formData.yearOfStudy}
                                onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                                min="1"
                                max="8"
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
                            Add Student
                        </button>
                    </form>
                )}

                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                        <p>Loading students...</p>
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
                                    <th style={{ padding: "15px", textAlign: "left" }}>Name</th>
                                    <th style={{ padding: "15px", textAlign: "left" }}>Email</th>
                                    <th style={{ padding: "15px", textAlign: "left" }}>Phone</th>
                                    <th style={{ padding: "15px", textAlign: "left" }}>Department</th>
                                    <th style={{ padding: "15px", textAlign: "left" }}>Course</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: "20px", textAlign: "center", color: "var(--text-light)" }}>
                                            No students found
                                        </td>
                                    </tr>
                                ) : (
                                    students.map((student) => (
                                        <tr key={student.StudentId} style={{ borderBottom: "1px solid var(--border)" }}>
                                            <td style={{ padding: "15px" }}>{student.FirstName} {student.LastName}</td>
                                            <td style={{ padding: "15px" }}>{student.Email}</td>
                                            <td style={{ padding: "15px" }}>{student.Phone || "-"}</td>
                                            <td style={{ padding: "15px" }}>{student.Department || "-"}</td>
                                            <td style={{ padding: "15px" }}>{student.Course || "-"}</td>
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

export default Students;
