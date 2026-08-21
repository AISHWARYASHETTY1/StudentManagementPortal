import { NavLink } from "react-router-dom";

function Sidebar({ onLogout }) {
    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                Student Portal
            </div>

            <nav>

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    My Profile
                </NavLink>

                <NavLink
                    to="/attendance"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Attendance
                </NavLink>

                <NavLink
                    to="/courses"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Courses
                </NavLink>

                <NavLink
                    to="/results"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Results
                </NavLink>

                <NavLink
                    to="/timetable"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Timetable
                </NavLink>

                <NavLink
                    to="/examinations"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Examinations
                </NavLink>

                <NavLink
                    to="/fees"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    Fee Details
                </NavLink>

                <NavLink
                    to="/payments"
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
