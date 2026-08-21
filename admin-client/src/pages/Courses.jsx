import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Courses = ({ admin, onLogout }) => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [enrollmentRequests, setEnrollmentRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        courseCode: "",
        courseName: "",
        department: "",
        credits: ""
    });

    useEffect(() => {
        fetchCourses();
        fetchEnrollmentRequests();
    }, []);

    const fetchEnrollmentRequests = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/courses/enrollment-requests");
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch enrollment requests");
            setEnrollmentRequests(data || []);
        } catch (error) {
            setError(error.message || "Failed to load enrollment requests");
        }
    };

    const approveEnrollment = async (studentCourseId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/courses/enrollment-requests/${studentCourseId}/approve`, { method: "PUT" });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Unable to approve enrollment");
            setEnrollmentRequests(current => current.filter(request => request.StudentCourseId !== studentCourseId));
        } catch (error) {
            setError(error.message || "Failed to approve enrollment request");
        }
    };

    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await fetch("http://localhost:5000/api/courses");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch courses");
            }

            setCourses(data || []);
        } catch (error) {
            console.error("Error fetching courses:", error);
            setError(error.message || "Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/courses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    courseCode: formData.courseCode,
                    courseName: formData.courseName,
                    department: formData.department,
                    credits: Number(formData.credits)
                })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Course could not be added");
            }

            setFormData({ courseCode: "", courseName: "", department: "", credits: "" });
            setShowForm(false);
            setError("");
            await fetchCourses();
        } catch (error) {
            console.error("Error adding course:", error);
            setError(error.message || "Failed to add course");
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
                    <h1 style={{ margin: 0, fontSize: "24px" }}>Courses Management</h1>
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
                        {showForm ? "Cancel" : "Add Course"}
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
                    <form onSubmit={handleAddCourse} style={{
                        background: "white",
                        padding: "20px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        border: "1px solid var(--border)"
                    }}>
                        <h3>Add New Course</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                            <input
                                type="text"
                                placeholder="Course Code"
                                value={formData.courseCode}
                                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
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
                                placeholder="Course Name"
                                value={formData.courseName}
                                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
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
                                type="number"
                                placeholder="Credits"
                                value={formData.credits}
                                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
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
                            Add Course
                        </button>
                    </form>
                )}

                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                        <p>Loading courses...</p>
                    </div>
                ) : (
                    <>
                    <div style={{
                        background: "white",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        overflow: "hidden"
                    }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "var(--light)", borderBottom: "2px solid var(--border)" }}>
                                    <th style={{ padding: "15px", textAlign: "left" }}>Code</th>
                                    <th style={{ padding: "15px", textAlign: "left" }}>Name</th>
                                    <th style={{ padding: "15px", textAlign: "left" }}>Department</th>
                                    <th style={{ padding: "15px", textAlign: "left" }}>Credits</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ padding: "20px", textAlign: "center", color: "var(--text-light)" }}>
                                            No courses found
                                        </td>
                                    </tr>
                                ) : (
                                    courses.map((course) => (
                                        <tr key={course.CourseId} style={{ borderBottom: "1px solid var(--border)" }}>
                                            <td style={{ padding: "15px" }}>{course.CourseCode}</td>
                                            <td style={{ padding: "15px" }}>{course.CourseName}</td>
                                            <td style={{ padding: "15px" }}>{course.Department || "-"}</td>
                                            <td style={{ padding: "15px" }}>{course.Credits}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ background: "white", borderRadius: "8px", border: "1px solid var(--border)", overflow: "hidden", marginTop: "20px" }}>
                        <div style={{ padding: "18px 15px", borderBottom: "1px solid var(--border)" }}><h3 style={{ margin: 0 }}>Pending Enrollment Requests</h3></div>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr style={{ background: "var(--light)" }}><th style={{ padding: "12px", textAlign: "left" }}>Student</th><th style={{ padding: "12px", textAlign: "left" }}>Course</th><th style={{ padding: "12px", textAlign: "left" }}>Requested</th><th style={{ padding: "12px", textAlign: "left" }}>Action</th></tr></thead><tbody>
                            {enrollmentRequests.length === 0 ? <tr><td colSpan="4" style={{ padding: "16px", textAlign: "center", color: "var(--text-light)" }}>No pending enrollment requests.</td></tr> : enrollmentRequests.map(request => <tr key={request.StudentCourseId} style={{ borderTop: "1px solid var(--border)" }}><td style={{ padding: "12px" }}>{request.StudentName} ({request.StudentCode})</td><td style={{ padding: "12px" }}>{request.CourseCode} - {request.CourseName}</td><td style={{ padding: "12px" }}>{new Date(request.EnrollmentDate).toLocaleDateString()}</td><td style={{ padding: "12px" }}><button className="button button-primary" onClick={() => approveEnrollment(request.StudentCourseId)}>Approve</button></td></tr>)}
                        </tbody></table>
                    </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Courses;
