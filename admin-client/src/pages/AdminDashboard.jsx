import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const DashboardIcon = ({ type }) => {
    const shared = { fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" };

    const icons = {
        students: <><circle cx="10" cy="8" r="4" {...shared} /><path d="M3 22c.7-5 3.2-8 7-8s6.3 3 7 8" {...shared} /><circle cx="19" cy="18" r="4" {...shared} /><path d="m17.4 18 1.1 1.1 2.1-2.2" {...shared} /></>,
        activeStudents: <><path d="M12 3 2.5 7.5 12 12l9.5-4.5L12 3Z" {...shared} /><path d="M6 10.2V15c2.9 2.2 9.1 2.2 12 0v-4.8" {...shared} /><path d="M21.5 8v6" {...shared} /><circle cx="12" cy="16.5" r="2.5" {...shared} /></>,
        courses: <><path d="M3 8.5 12 4l9 4.5L12 13 3 8.5Z" {...shared} /><path d="M6.5 11v4.2c2.7 2.4 8.3 2.4 11 0V11" {...shared} /><path d="M20 9v5" {...shared} /><circle cx="20" cy="15.5" r="1.2" fill="currentColor" /></>,
        attendance: <><path d="M8 4h12v11H8z" {...shared} /><path d="M11 8h6M11 11h4" {...shared} /><circle cx="5" cy="11" r="2" {...shared} /><path d="M5 13v7m0-4 3 3m-3-2-2 4" {...shared} /><path d="M8 20h12" {...shared} /></>,
        results: <><path d="M7 3h8l4 4v14H7z" {...shared} /><path d="M15 3v5h4" {...shared} /><path d="m10 12 1.5 1.5L14 10.8M10 17l1.5 1.5L14 15.8M16 12h1M16 17h1" {...shared} /></>,
        exams: <><rect x="6" y="4" width="13" height="17" rx="2" {...shared} /><path d="M10 4v-1h5v1M9 10h7M9 14h4M9 18h5" {...shared} /><path d="m4 16 1.4 1.4L8 14.8" {...shared} /></>,
        fees: <><path d="M4 9.5 10.5 3H21v10.5L14.5 20 4 9.5Z" {...shared} /><circle cx="16.5" cy="7.5" r="1.2" {...shared} /><path d="M11 10.5c.7-1 2.8-.8 2.8.5 0 1.7-3.5 1.1-3.5 2.8 0 1.4 2.4 1.7 3.4.5M12 9.5v6" {...shared} /></>,
        payments: <><rect x="5" y="3" width="14" height="18" rx="2" {...shared} /><path d="M9 7h6M9 11h4M9 15h3" {...shared} /><circle cx="18" cy="17" r="4" fill="var(--surface)" stroke="currentColor" strokeWidth="1.8" /><path d="M18 14.8v4.4m1.4-3c-.4-.8-2.4-.8-2.4.2 0 1.3 2.7.6 2.7 1.9 0 1-2.1 1.1-2.6.2" {...shared} /></>
    };

    return <svg className="stat-card-icon" viewBox="0 0 24 24" aria-hidden="true">{icons[type]}</svg>;
};

const AdminDashboard = ({ admin, onLogout }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalStudents: 0,
        activeStudents: 0,
        totalCourses: 0,
        totalAttendance: 0,
        totalResults: 0,
        upcomingExams: 0,
        pendingFees: 0,
        totalPayments: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            setError("");

            const [studentsResponse, coursesResponse, feesResponse, paymentsResponse, examsResponse, attendanceResponse, resultsResponse] = await Promise.all([
                fetch("http://localhost:5000/api/students"),
                fetch("http://localhost:5000/api/courses"),
                fetch("http://localhost:5000/api/fees"),
                fetch("http://localhost:5000/api/payments"),
                fetch("http://localhost:5000/api/examinations"),
                fetch("http://localhost:5000/api/attendance"),
                fetch("http://localhost:5000/api/students/marks")
            ]);

            const studentsData = await studentsResponse.json();
            const coursesData = await coursesResponse.json();
            const feesData = await feesResponse.json();
            const paymentsData = await paymentsResponse.json();
            const examsData = await examsResponse.json();
            const attendanceData = await attendanceResponse.json();
            const resultsData = await resultsResponse.json();

            setStats({
                totalStudents: studentsData.length || 0,
                activeStudents: (studentsData || []).filter(s => s.IsActive === 1 || s.IsActive === true).length || 0,
                totalCourses: coursesData.length || 0,
                totalAttendance: Array.isArray(attendanceData) ? attendanceData.length : 0,
                totalResults: Array.isArray(resultsData) ? resultsData.length : 0,
                upcomingExams: examsData.length || 0,
                pendingFees: (feesData || []).filter(f => f.Status && f.Status.toLowerCase() === "pending").length || 0,
                totalPayments: paymentsData.length || 0
            });

        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            setError("Failed to load dashboard statistics");
            setStats({
                totalStudents: 0,
                activeStudents: 0,
                totalCourses: 0,
                totalAttendance: 0,
                totalResults: 0,
                upcomingExams: 0,
                pendingFees: 0,
                totalPayments: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        onLogout();
        navigate("/login");
    };

    const StatCard = ({ title, value, icon, onClick }) => (
        <div className="stat-card" onClick={onClick}>
            <div className="stat-card-header">
                <span>{title}</span>
            </div>
            <div className="value">{value}</div>
            <DashboardIcon type={icon} />
        </div>
    );

    const navigation = [
        ["/dashboard", "Dashboard"], ["/students", "Students"], ["/courses", "Courses"],
        ["/attendance", "Attendance"], ["/results", "Results"], ["/examinations", "Examinations"],
        ["/fees", "Fees"], ["/payments", "Payments"]
    ];

    return (
        <div className="admin-shell">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-brand"><span className="brand-mark">SP</span><span>Student Portal</span></div>
                <p className="admin-sidebar-label">Workspace</p>
                <nav>{navigation.map(([path, label]) => <NavLink key={path} to={path} end={path === "/dashboard"}>{label}</NavLink>)}</nav>
                <button className="admin-sidebar-signout" onClick={handleLogout}><span className="logout-icon" aria-hidden="true">↪</span>Sign out</button>
            </aside>
            <div className="admin-shell-main">
              <header className="admin-dashboard-header">
                <div>
                    <p className="eyebrow">Overview</p>
                    <h1>Admin Dashboard</h1>
                    <p className="welcome-text">Welcome, {admin?.Name || "Admin"}</p>
                </div>
                <div className="admin-user-chip"><span className="admin-user-avatar">{(admin?.Name || "A").charAt(0).toUpperCase()}</span><span>{admin?.Name || "Administrator"}</span><button className="logout-button" onClick={handleLogout}><span className="logout-icon" aria-hidden="true">↪</span>Sign out</button></div>
              </header>

              <main className="admin-dashboard-main">
                {error && (
                    <div className="error-message" style={{ marginBottom: "20px" }}>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="dashboard-loader">
                        <div className="loading-spinner" style={{ marginLeft: "auto", marginRight: "auto" }}></div>
                        <p>Loading dashboard...</p>
                    </div>
                ) : (
                    <div className="admin-dashboard-grid">
                        <StatCard title="Total Students" value={stats.totalStudents} icon="students" onClick={() => navigate("/students")} />
                        <StatCard title="Active Students" value={stats.activeStudents} icon="activeStudents" onClick={() => navigate("/students")} />
                        <StatCard title="Total Courses" value={stats.totalCourses} icon="courses" onClick={() => navigate("/courses")} />
                        <StatCard title="Attendance Records" value={stats.totalAttendance} icon="attendance" onClick={() => navigate("/attendance")} />
                        <StatCard title="Results" value={stats.totalResults} icon="results" onClick={() => navigate("/results")} />
                        <StatCard title="Upcoming Exams" value={stats.upcomingExams} icon="exams" onClick={() => navigate("/examinations")} />
                        <StatCard title="Pending Fees" value={stats.pendingFees} icon="fees" onClick={() => navigate("/fees")} />
                        <StatCard title="Total Payments" value={stats.totalPayments} icon="payments" onClick={() => navigate("/payments")} />
                    </div>
                )}
              </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
