const Navbar = ({ student }) => {
    const firstName = student?.FirstName || student?.firstName || "Student";

    return (
        <header className="navbar">
            <div className="navbar-title">Student Dashboard</div>
            <div className="navbar-right">
                <div className="student-profile">
                    <div className="profile-avatar">{firstName.charAt(0).toUpperCase()}</div>
                    <div>
                        <div className="student-name">{firstName}</div>
                        <div className="student-role">Student</div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
