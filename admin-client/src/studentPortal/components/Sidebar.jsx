import { NavLink } from "react-router-dom";

function Sidebar({ onLogout }) {
    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                Student Portal
            </div>

            <nav>

                <NavLink
                    to="/student-portal/dashboard"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/student-portal/profile"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    My Profile
                </NavLink>

                <NavLink
                    to="/student-portal/attendance"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Attendance
                </NavLink>

                <NavLink
                    to="/student-portal/courses"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Courses
                </NavLink>

                <NavLink
                    to="/student-portal/results"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Results
                </NavLink>

                <NavLink
                    to="/student-portal/timetable"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Timetable
                </NavLink>

                <NavLink
                    to="/student-portal/examinations"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Examinations
                </NavLink>

                <NavLink
                    to="/student-portal/fees"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Fee Details
                </NavLink>

                <NavLink
                    to="/student-portal/payments"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Payment History
                </NavLink>

            </nav>

<div className="sidebar-bottom">

    <button
        type="button"
        className="sidebar-logout"
        onClick={onLogout}
    >
        <span className="logout-icon" aria-hidden="true">↪</span>
        <span>Sign out</span>
    </button>

</div>

        </aside>
    );
}

export default Sidebar;
