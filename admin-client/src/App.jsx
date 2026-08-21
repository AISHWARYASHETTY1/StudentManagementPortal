import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import StudentPortalApp from "./studentPortal/App";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Attendance from "./pages/Attendance";
import Results from "./pages/Results";
import Examinations from "./pages/Examinations";
import Fees from "./pages/Fees";
import Payments from "./pages/Payments";

function App() {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    const [student, setStudent] = useState(null);

    useEffect(() => {
        const storedAdmin = localStorage.getItem("admin");
        const token = localStorage.getItem("adminToken");
        const storedStudent = localStorage.getItem("student");

        if (storedAdmin && token) {
            setAdmin(JSON.parse(storedAdmin));
        }

        if (storedStudent) {
            setStudent(JSON.parse(storedStudent));
        }

        setLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("admin");
        localStorage.removeItem("adminToken");
        setAdmin(null);
    };

    const handleStudentLogout = () => {
        localStorage.removeItem("student");
        localStorage.removeItem("studentCode");
        localStorage.removeItem("studentToken");
        setStudent(null);
    };

    if (loading) {
        return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={
                        admin ? (
                            <Navigate to="/dashboard" />
                        ) : (
                            <AdminLogin onLoginSuccess={setAdmin} onStudentLoginSuccess={setStudent} />
                        )
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        admin ? (
                            <AdminDashboard admin={admin} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="/student-portal/*"
                    element={
                        student ? (
                            <StudentPortalApp initialStudent={student} onLogout={handleStudentLogout} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                <Route
                    path="/students"
                    element={
                        admin ? (
                            <Students admin={admin} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="/courses"
                    element={
                        admin ? (
                            <Courses admin={admin} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="/attendance"
                    element={
                        admin ? (
                            <Attendance admin={admin} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="/results"
                    element={
                        admin ? (
                            <Results admin={admin} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="/examinations"
                    element={
                        admin ? (
                            <Examinations admin={admin} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="/fees"
                    element={
                        admin ? (
                            <Fees admin={admin} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="/payments"
                    element={
                        admin ? (
                            <Payments admin={admin} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                <Route
                    path="/"
                    element={<Navigate to={admin ? "/dashboard" : student ? "/student-portal" : "/login"} />}
                />
            </Routes>
        </Router>
    );
}

export default App;
