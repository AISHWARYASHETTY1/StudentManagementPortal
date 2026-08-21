import { useState, useEffect } from "react";
import {
    Routes,
    Route,
    Navigate,
    useNavigate
} from "react-router-dom";

import "./App.css";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Attendance from "./pages/Attendance";
import Courses from "./pages/Courses";
import AcademicResults from "./pages/AcademicResults";
import ClassTimetable from "./pages/ClassTimetable";
import Examinations from "./pages/Examinations";
import FeeDetails from "./pages/FeeDetails";
import PaymentHistory from "./pages/PaymentHistory";

function App({ initialStudent, onLogout }) {
    const navigate = useNavigate();
    const [studentCode, setStudentCode] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [student, setStudent] = useState(initialStudent || (() => {
        const saved = localStorage.getItem("student");
        return saved ? JSON.parse(saved) : null;
    }));

    useEffect(() => {
        if (student) {
            localStorage.setItem("student", JSON.stringify(student));
        } else {
            localStorage.removeItem("student");
        }
    }, [student]);

    const handleLogin = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    studentCode,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            setStudent(data.student);
            localStorage.setItem("student", JSON.stringify(data.student));
            localStorage.setItem("studentToken", data.token);
            navigate("/student-portal/dashboard");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setStudent(null);
        setStudentCode("");
        setPassword("");
        setError("");
        localStorage.removeItem("student");
        localStorage.removeItem("studentToken");
        if (onLogout) onLogout();
        navigate("/login");
    };

    return (
        <>
            {!student ? (
                <div className="login-page">
                    <div className="login-card">
                        <h1>Student Portal</h1>

                        <p className="subtitle">
                            Sign in to access your academic portal
                        </p>

                        <form onSubmit={handleLogin}>
                            <label htmlFor="studentCode">Student Code</label>
                            <input
                                id="studentCode"
                                type="text"
                                placeholder="Enter your student code"
                                value={studentCode}
                                onChange={(event) => setStudentCode(event.target.value)}
                                required
                            />

                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                            />

                            {error && <p className="error-message">{error}</p>}

                            <button type="submit" disabled={loading}>
                                {loading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>

                        <div className="demo-help">
                            <strong>Demo:</strong> use a valid student code like STU001 and password <strong>Student@123</strong>
                        </div>
                    </div>
                </div>
            ) : (
                <Routes>
                    <Route path="/" element={<Navigate to="dashboard" replace />} />

                    <Route element={<Layout student={student} onLogout={handleLogout} />}>
                        <Route path="dashboard" element={<Dashboard student={student} />} />
                        <Route path="profile" element={<Profile student={student} />} />
                        <Route path="attendance" element={<Attendance student={student} />} />
                        <Route path="courses" element={<Courses />} />
                        <Route path="results" element={<AcademicResults />} />
                        <Route path="timetable" element={<ClassTimetable />} />
                        <Route path="examinations" element={<Examinations />} />
                        <Route path="fees" element={<FeeDetails />} />
                        <Route path="payments" element={<PaymentHistory />} />
                    </Route>

                    <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
            )}
        </>
    );
}

export default App;
