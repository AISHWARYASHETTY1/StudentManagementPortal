import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getLocalDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60_000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 16);
};

const apiFetch = async (path, options = {}) => {
    let response;
    try {
        response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: { "Content-Type": "application/json", ...(options.headers || {}) }
        });
    } catch {
        throw new Error("Unable to connect to the server. Make sure the API is running on port 5000.");
    }

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
        ? await response.json()
        : { message: await response.text() };
    if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
    return data;
};

const Attendance = ({ admin, onLogout }) => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [classDateTime, setClassDateTime] = useState(getLocalDateTime);
    const [students, setStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [allRecords, setAllRecords] = useState([]);
    const [showBulkForm, setShowBulkForm] = useState(true);
    const [tab, setTab] = useState("bulk"); // "bulk" or "history"

    // Fetch all courses on mount
    useEffect(() => {
        fetchCourses();
        if (tab === "history") {
            fetchAttendanceHistory();
        }
    }, [tab]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await apiFetch("/courses");

            setCourses(data || []);
            setError("");
        } catch (error) {
            console.error("Error fetching courses:", error);
            setError("Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentsByCourse = async (courseId) => {
        try {
            setLoading(true);
            setError("");
            setSuccessMessage("");

            const data = await apiFetch(`/attendance/course/students?courseId=${encodeURIComponent(courseId)}`);

            setStudents(data.students || []);
            
            // Initialize attendance data for all students
            const initialData = {};
            (data.students || []).forEach(student => {
                initialData[student.StudentId] = "Present"; // Default to Present
            });
            setAttendanceData(initialData);

        } catch (error) {
            console.error("Error fetching students:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendanceHistory = async () => {
        try {
            setLoading(true);
            const data = await apiFetch("/attendance");

            setAllRecords(data || []);
        } catch (error) {
            console.error("Error fetching attendance:", error);
            setError("Failed to load attendance history");
        } finally {
            setLoading(false);
        }
    };

    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        setSelectedCourse(courseId);
        if (courseId) {
            fetchStudentsByCourse(courseId);
        } else {
            setStudents([]);
            setAttendanceData({});
        }
    };

    const handleStatusChange = (studentId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const handleBulkSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCourse) {
            setError("Please select a course");
            return;
        }

        if (!classDateTime || Number.isNaN(new Date(classDateTime).getTime())) {
            setError("Please choose a valid class date and time");
            return;
        }

        if (students.length === 0) {
            setError("No students enrolled in this course");
            return;
        }

        try {
            setSubmitting(true);
            setError("");
            setSuccessMessage("");

            const attendanceRecords = students.map(student => ({
                studentId: student.StudentId,
                status: attendanceData[student.StudentId] || "Present"
            }));

            const data = await apiFetch("/attendance/bulk-mark", {
                method: "POST",
                body: JSON.stringify({
                    courseId: Number(selectedCourse),
                    attendanceDate: classDateTime,
                    attendanceRecords
                })
            });

            setSuccessMessage(`✅ Attendance marked successfully for ${data.successRecords.length}/${data.totalRecords} students`);
            
            // Reset form
            setTimeout(() => {
                setSelectedCourse("");
                setClassDateTime(getLocalDateTime());
                setStudents([]);
                setAttendanceData({});
                setSuccessMessage("");
            }, 2000);

            // Refresh history
            if (tab === "history") {
                fetchAttendanceHistory();
            }

        } catch (error) {
            console.error("Error marking attendance:", error);
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoBack = () => {
        navigate("/dashboard");
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "present":
                return { bg: "#e0ffe0", text: "#006600" };
            case "absent":
                return { bg: "#ffe0e0", text: "#cc0000" };
            case "late":
                return { bg: "#fff4e0", text: "#cc6600" };
            default:
                return { bg: "#f0f0f0", text: "#666" };
        }
    };

    const selectedCourseObj = courses.find(c => c.CourseId === Number(selectedCourse));

    return (
        <div className="legacy-admin-page attendance-admin-page" style={{ minHeight: "100vh", background: "#f5f5f5" }}>
            {/* Header */}
            <div style={{
                background: "white",
                padding: "20px",
                borderBottom: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: "24px", color: "#333" }}>📊 Attendance Management</h1>
                    <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>Bulk mark attendance for multiple students</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        onClick={handleGoBack}
                        style={{
                            padding: "10px 20px",
                            background: "#2c3e50",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                    >
                        ← Back
                    </button>
                    <button
                        onClick={onLogout}
                        style={{
                            padding: "10px 20px",
                            background: "#e74c3c",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{
                background: "white",
                borderBottom: "1px solid #ddd",
                padding: "0 20px",
                display: "flex",
                gap: "20px"
            }}>
                <button
                    onClick={() => setTab("bulk")}
                    style={{
                        padding: "15px 20px",
                        background: "transparent",
                        border: "none",
                        borderBottom: tab === "bulk" ? "3px solid #3498db" : "none",
                        color: tab === "bulk" ? "#3498db" : "#666",
                        cursor: "pointer",
                        fontWeight: tab === "bulk" ? "600" : "400",
                        fontSize: "16px"
                    }}
                >
                    📝 Mark Attendance
                </button>
                <button
                    onClick={() => setTab("history")}
                    style={{
                        padding: "15px 20px",
                        background: "transparent",
                        border: "none",
                        borderBottom: tab === "history" ? "3px solid #3498db" : "none",
                        color: tab === "history" ? "#3498db" : "#666",
                        cursor: "pointer",
                        fontWeight: tab === "history" ? "600" : "400",
                        fontSize: "16px"
                    }}
                >
                    📋 History
                </button>
            </div>

            {/* Content */}
            <div style={{ padding: "30px 20px", maxWidth: "1200px", margin: "0 auto" }}>
                {/* Messages */}
                {error && (
                    <div style={{
                        background: "#fee",
                        border: "1px solid #e74c3c",
                        color: "#c0392b",
                        padding: "15px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        fontWeight: "500"
                    }}>
                        ❌ {error}
                    </div>
                )}

                {successMessage && (
                    <div style={{
                        background: "#e8f8f5",
                        border: "1px solid #27ae60",
                        color: "#16a085",
                        padding: "15px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        fontWeight: "500"
                    }}>
                        {successMessage}
                    </div>
                )}

                {/* BULK MARKING TAB */}
                {tab === "bulk" && (
                    <>
                        {/* Course Selection Card */}
                        <div style={{
                            background: "white",
                            padding: "25px",
                            borderRadius: "8px",
                            marginBottom: "25px",
                            border: "1px solid #ddd",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                        }}>
                            <h2 style={{ margin: "0 0 20px 0", color: "#333" }}>Step 1: Select Course</h2>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                <div>
                                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
                                        📚 Choose Course:
                                    </label>
                                    <select
                                        value={selectedCourse}
                                        onChange={handleCourseChange}
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            border: "1px solid #ddd",
                                            borderRadius: "6px",
                                            fontSize: "16px",
                                            fontWeight: "500",
                                            cursor: "pointer",
                                            background: "white"
                                        }}
                                    >
                                        <option value="">-- Select a Course --</option>
                                        {courses.map(course => (
                                            <option key={course.CourseId} value={course.CourseId}>
                                                {course.CourseCode} - {course.CourseName} ({course.Credits} Credits)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#333" }}>
                                        Class date and time:
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={classDateTime}
                                        onChange={(e) => setClassDateTime(e.target.value)}
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "12px",
                                            border: "1px solid #ddd",
                                            borderRadius: "6px",
                                            fontSize: "16px",
                                            boxSizing: "border-box"
                                        }}
                                    />
                                    <p style={{ margin: "6px 0 0", color: "#666", fontSize: "12px" }}>
                                        This identifies the class session being marked.
                                    </p>
                                </div>

                                {selectedCourseObj && (
                                    <div style={{
                                        background: "#ecf0f1",
                                        padding: "12px",
                                        borderRadius: "6px",
                                        display: "flex",
                                        alignItems: "center"
                                    }}>
                                        <div>
                                            <p style={{ margin: "0 0 5px 0", fontSize: "12px", color: "#666" }}>Selected:</p>
                                            <p style={{ margin: 0, fontWeight: "600", color: "#333" }}>
                                                {selectedCourseObj.CourseCode} - {selectedCourseObj.CourseName}
                                            </p>
                                            <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#666" }}>
                                                👥 {students.length} student(s) enrolled
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Students Table */}
                        {students.length > 0 && (
                            <form onSubmit={handleBulkSubmit}>
                                <div style={{
                                    background: "white",
                                    borderRadius: "8px",
                                    border: "1px solid #ddd",
                                    marginBottom: "25px",
                                    overflow: "hidden",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                                }}>
                                    <div style={{ padding: "20px", borderBottom: "1px solid #ddd" }}>
                                        <h2 style={{ margin: 0, color: "#333" }}>Step 2: Mark Attendance</h2>
                                        <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "14px" }}>
                                            Select attendance status for each student
                                        </p>
                                    </div>

                                    {/* Quick Mark Buttons */}
                                    <div style={{
                                        padding: "15px 20px",
                                        background: "#f8f9fa",
                                        borderBottom: "1px solid #ddd",
                                        display: "flex",
                                        gap: "10px"
                                    }}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newData = {};
                                                students.forEach(s => newData[s.StudentId] = "Present");
                                                setAttendanceData(newData);
                                            }}
                                            style={{
                                                padding: "8px 16px",
                                                background: "#27ae60",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                fontWeight: "600",
                                                fontSize: "14px"
                                            }}
                                        >
                                            ✓ All Present
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newData = {};
                                                students.forEach(s => newData[s.StudentId] = "Absent");
                                                setAttendanceData(newData);
                                            }}
                                            style={{
                                                padding: "8px 16px",
                                                background: "#e74c3c",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                fontWeight: "600",
                                                fontSize: "14px"
                                            }}
                                        >
                                            ✗ All Absent
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newData = {};
                                                students.forEach(s => newData[s.StudentId] = "Late");
                                                setAttendanceData(newData);
                                            }}
                                            style={{
                                                padding: "8px 16px",
                                                background: "#f39c12",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                fontWeight: "600",
                                                fontSize: "14px"
                                            }}
                                        >
                                            ⏱ All Late
                                        </button>
                                    </div>

                                    {/* Student List */}
                                    <div style={{ overflow: "hidden" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                            <thead>
                                                <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #ddd" }}>
                                                    <th style={{ padding: "12px 20px", textAlign: "left", fontWeight: "600", color: "#333" }}>#</th>
                                                    <th style={{ padding: "12px 20px", textAlign: "left", fontWeight: "600", color: "#333" }}>Roll No</th>
                                                    <th style={{ padding: "12px 20px", textAlign: "left", fontWeight: "600", color: "#333" }}>Student Name</th>
                                                    <th style={{ padding: "12px 20px", textAlign: "left", fontWeight: "600", color: "#333" }}>Email</th>
                                                    <th style={{ padding: "12px 20px", textAlign: "center", fontWeight: "600", color: "#333" }}>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {students.map((student, index) => (
                                                    <tr key={student.StudentId} style={{
                                                        borderBottom: "1px solid #ddd",
                                                        background: index % 2 === 0 ? "white" : "#f9f9f9",
                                                        transition: "background-color 0.2s"
                                                    }}>
                                                        <td style={{ padding: "12px 20px", color: "#666" }}>{index + 1}</td>
                                                        <td style={{ padding: "12px 20px", fontWeight: "600", color: "#333" }}>
                                                            {student.StudentCode}
                                                        </td>
                                                        <td style={{ padding: "12px 20px", color: "#333" }}>
                                                            {student.FirstName} {student.LastName}
                                                        </td>
                                                        <td style={{ padding: "12px 20px", color: "#666", fontSize: "14px" }}>
                                                            {student.Email}
                                                        </td>
                                                        <td style={{ padding: "12px 20px", textAlign: "center" }}>
                                                            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                                                {["Present", "Absent", "Late"].map(status => (
                                                                    <label key={status} style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: "5px",
                                                                        cursor: "pointer",
                                                                        padding: "6px 12px",
                                                                        borderRadius: "4px",
                                                                        background: attendanceData[student.StudentId] === status ? getStatusColor(status).bg : "transparent",
                                                                        color: attendanceData[student.StudentId] === status ? getStatusColor(status).text : "#666",
                                                                        fontWeight: attendanceData[student.StudentId] === status ? "600" : "400",
                                                                        border: attendanceData[student.StudentId] === status ? `2px solid ${getStatusColor(status).text}` : "1px solid #ddd",
                                                                        transition: "all 0.2s"
                                                                    }}>
                                                                        <input
                                                                            type="radio"
                                                                            name={`attendance-${student.StudentId}`}
                                                                            value={status}
                                                                            checked={attendanceData[student.StudentId] === status}
                                                                            onChange={() => handleStatusChange(student.StudentId, status)}
                                                                            style={{ cursor: "pointer" }}
                                                                        />
                                                                        <span style={{ fontSize: "12px" }}>{status}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        style={{
                                            padding: "15px 40px",
                                            background: submitting ? "#95a5a6" : "#27ae60",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "6px",
                                            cursor: submitting ? "not-allowed" : "pointer",
                                            fontWeight: "600",
                                            fontSize: "16px",
                                            transition: "background-color 0.3s"
                                        }}
                                    >
                                        {submitting ? "Submitting..." : "✓ Submit Attendance"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedCourse("");
                                            setClassDateTime(getLocalDateTime());
                                            setStudents([]);
                                            setAttendanceData({});
                                        }}
                                        style={{
                                            padding: "15px 40px",
                                            background: "#95a5a6",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontWeight: "600",
                                            fontSize: "16px"
                                        }}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </form>
                        )}

                        {selectedCourse && students.length === 0 && !loading && (
                            <div style={{
                                background: "#fff3cd",
                                border: "1px solid #ffc107",
                                color: "#856404",
                                padding: "15px",
                                borderRadius: "8px",
                                textAlign: "center"
                            }}>
                                ⚠️ No students enrolled in this course
                            </div>
                        )}
                    </>
                )}

                {/* HISTORY TAB */}
                {tab === "history" && (
                    <div style={{
                        background: "white",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        overflow: "hidden"
                    }}>
                        {loading ? (
                            <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                                Loading attendance history...
                            </div>
                        ) : allRecords.length === 0 ? (
                            <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                                📋 No attendance records found
                            </div>
                        ) : (
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #ddd" }}>
                                        <th style={{ padding: "12px 20px", textAlign: "left", fontWeight: "600" }}>#</th>
                                        <th style={{ padding: "12px 20px", textAlign: "left", fontWeight: "600" }}>Student ID</th>
                                        <th style={{ padding: "12px 20px", textAlign: "left", fontWeight: "600" }}>Course ID</th>
                                        <th style={{ padding: "12px 20px", textAlign: "left", fontWeight: "600" }}>Class date & time</th>
                                        <th style={{ padding: "12px 20px", textAlign: "center", fontWeight: "600" }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allRecords.map((record, index) => (
                                        <tr key={record.AttendanceId} style={{
                                            borderBottom: "1px solid #ddd",
                                            background: index % 2 === 0 ? "white" : "#f9f9f9"
                                        }}>
                                            <td style={{ padding: "12px 20px" }}>{index + 1}</td>
                                            <td style={{ padding: "12px 20px", fontWeight: "600" }}>{record.StudentId}</td>
                                            <td style={{ padding: "12px 20px" }}>{record.CourseId}</td>
                                            <td style={{ padding: "12px 20px", color: "#666" }}>
                                                {new Date(record.AttendanceDate).toLocaleString([], {
                                                    dateStyle: "medium",
                                                    timeStyle: "short"
                                                })}
                                            </td>
                                            <td style={{ padding: "12px 20px", textAlign: "center" }}>
                                                <span style={{
                                                    padding: "6px 12px",
                                                    borderRadius: "4px",
                                                    background: getStatusColor(record.Status).bg,
                                                    color: getStatusColor(record.Status).text,
                                                    fontWeight: "600",
                                                    fontSize: "14px"
                                                }}>
                                                    {record.Status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Attendance;
