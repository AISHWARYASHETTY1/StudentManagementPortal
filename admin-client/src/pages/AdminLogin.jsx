import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminLogin = ({ onLoginSuccess, onStudentLoginSuccess }) => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState("admin");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [studentCode, setStudentCode] = useState("");
    const [studentPassword, setStudentPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showStudentPassword, setShowStudentPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/admin/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Admin login failed");
                return;
            }

            localStorage.setItem("adminToken", data.token);
            localStorage.setItem("admin", JSON.stringify(data.admin));

            if (onLoginSuccess) {
                onLoginSuccess(data.admin);
            }

            navigate("/dashboard");
        } catch (error) {
            setError(`Unable to connect to the admin service at ${API_URL}. Start the server with "npm start" in the server folder.`);
            console.error("Admin login error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStudentLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    studentCode,
                    password: studentPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Student login failed");
                return;
            }

            localStorage.setItem("student", JSON.stringify(data.student));
            localStorage.setItem("studentToken", data.token);
            localStorage.setItem("studentCode", data.student?.StudentCode || studentCode);

            if (onStudentLoginSuccess) {
                onStudentLoginSuccess(data.student);
            }

            navigate("/student-portal/dashboard");
        } catch (error) {
            setError(`Unable to connect to the student service at ${API_URL}. Start the server with "npm start" in the server folder.`);
            console.error("Student login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="portal-login-page">
            <div className="portal-login-shell">
                <div className="portal-brand-panel">
                    <div className="portal-logo" aria-label="Student Portal">
                        <span className="portal-logo-mark">SP</span>
                        <span>StudentPortal</span>
                    </div>
                    <div className="brand-badge">Secure academic workspace</div>
                    <h1>Everything your institution needs, in one place.</h1>
                    <p>
                        A clear, dependable workspace for student records, attendance, assessments, and finance.
                    </p>

                    <div className="brand-points">
                        <div>
                            <span>✓</span>
                            <p>Admin controls</p>
                        </div>
                        <div>
                            <span>✓</span>
                            <p>Student access</p>
                        </div>
                        <div>
                            <span>✓</span>
                            <p>Live academic data</p>
                        </div>
                    </div>
                </div>

                <div className="portal-form-panel">
                    <div className="role-toggle" aria-label="Select portal type">
                        <button
                            type="button"
                            className={selectedRole === "admin" ? "role-option active" : "role-option"}
                            onClick={() => setSelectedRole("admin")}
                        >
                            Admin Login
                        </button>
                        <button
                            type="button"
                            className={selectedRole === "student" ? "role-option active" : "role-option"}
                            onClick={() => setSelectedRole("student")}
                        >
                            Student Login
                        </button>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {selectedRole === "admin" ? (
                        <form onSubmit={handleAdminLogin} className="portal-form">
                            <div className="form-header">
                                <p className="form-eyebrow">Administrator access</p>
                                <h2>Welcome back</h2>
                                <p>Sign in to manage your institution.</p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="password-field">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                    <button type="button" className="password-toggle" onClick={() => setShowPassword(value => !value)}>
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="login-btn" disabled={loading}>
                                {loading ? <><span className="loading-spinner"></span> Signing in...</> : "Login as Admin"}
                            </button>

                            <div className="demo-box">
                                <p>Demo credentials</p>
                                <strong>Username:</strong> admin<br />
                                <strong>Password:</strong> Admin@123
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleStudentLogin} className="portal-form">
                            <div className="form-header">
                                <p className="form-eyebrow">Student access</p>
                                <h2>Access your portal</h2>
                                <p>View your academic records and progress.</p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="studentCode">Student Code</label>
                                <input
                                    type="text"
                                    id="studentCode"
                                    placeholder="Enter your student code"
                                    value={studentCode}
                                    onChange={(e) => setStudentCode(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="studentPassword">Password</label>
                                <div className="password-field">
                                    <input
                                        type={showStudentPassword ? "text" : "password"}
                                        id="studentPassword"
                                        placeholder="Enter your password"
                                        value={studentPassword}
                                        onChange={(e) => setStudentPassword(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                    <button type="button" className="password-toggle" onClick={() => setShowStudentPassword(value => !value)}>
                                        {showStudentPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="login-btn" disabled={loading}>
                                {loading ? <><span className="loading-spinner"></span> Logging in...</> : "Login as Student"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
