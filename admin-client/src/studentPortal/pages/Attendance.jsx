import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import { getStudentData } from "../api/studentApi";

const Attendance = ({ student }) => {
    const [summary, setSummary] = useState(null);
    const [courseSummary, setCourseSummary] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [filteredAttendance, setFilteredAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("date-desc");

    const fetchAttendance = async () => {
        if (!student) {
            setError("Student ID not available");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await getStudentData("/attendance");

            if (data.success) {
                setSummary(data.summary || null);
                setCourseSummary(data.courseSummary || []);
                setAttendance(data.attendance || []);
            } else {
                throw new Error(data.message || "Failed to fetch attendance");
            }

        } catch (error) {
            console.error("Attendance error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [student]);

    // Apply filters and sorting
    useEffect(() => {
        let filtered = [...attendance];

        // Filter by course
        if (selectedCourse !== "all") {
            filtered = filtered.filter(
                record => record.CourseId === parseInt(selectedCourse)
            );
        }

        // Filter by status
        if (selectedStatus !== "all") {
            filtered = filtered.filter(
                record => record.Status?.toLowerCase() === selectedStatus.toLowerCase()
            );
        }

        // Filter by search term
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(record =>
                (record.CourseCode?.toLowerCase().includes(term)) ||
                (record.CourseName?.toLowerCase().includes(term)) ||
                (record.Status?.toLowerCase().includes(term))
            );
        }

        // Sort
        if (sortBy === "date-asc") {
            filtered.sort((a, b) => new Date(a.AttendanceDate) - new Date(b.AttendanceDate));
        } else if (sortBy === "date-desc") {
            filtered.sort((a, b) => new Date(b.AttendanceDate) - new Date(a.AttendanceDate));
        } else if (sortBy === "course") {
            filtered.sort((a, b) => (a.CourseCode || "").localeCompare(b.CourseCode || ""));
        }

        setFilteredAttendance(filtered);
    }, [attendance, selectedCourse, selectedStatus, searchTerm, sortBy]);


    if (loading) {
        return (
            <div className="page-container">
                <h2>Attendance</h2>
                <p>Loading attendance...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <h2>Attendance</h2>
                <p className="error-message">{error}</p>
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="page-container">
                <h2>Attendance</h2>
                <p>No attendance data available</p>
            </div>
        );
    }

    const uniqueCourses = [...new Set(attendance.map(r => r.CourseId))];
    const courseOptions = uniqueCourses.map(courseId => {
        const course = attendance.find(r => r.CourseId === courseId);
        return {
            id: courseId,
            code: course?.CourseCode || `Course ${courseId}`,
            name: course?.CourseName || "Course"
        };
    });

    const pieData = [
        { name: "Present", value: summary.presentClasses },
        { name: "Absent", value: summary.absentClasses },
        { name: "Late", value: summary.lateClasses }
    ];

    const COLORS = ["#10b981", "#ef4444", "#f59e0b"];

    const courseChartData = courseSummary.map(course => ({
        name: course.courseCode,
        Present: course.present,
        Absent: course.absent,
        Late: course.late
    }));


    return (
        <div className="page-container">
            {/* HEADER */}
            <div className="page-header">
                <div>
                    <h1>Attendance</h1>
                    <p>View your attendance details</p>
                </div>
                <button className="refresh-btn" onClick={fetchAttendance}>
                    🔄 Refresh
                </button>
            </div>

            {/* ATTENDANCE WARNING/STATUS */}
            {summary.percentage < 75 ? (
                <div className="attendance-warning">
                    ⚠️ Your attendance is below the required 75%. Current: {summary.percentage}%
                </div>
            ) : (
                <div className="attendance-positive">
                    ✓ Your attendance is above the required 75%. Current: {summary.percentage}%
                </div>
            )}

            {/* SUMMARY CARDS */}
            <div className="attendance-summary">
                <div className="attendance-card">
                    <h3>Attendance %</h3>
                    <strong className="large-number">{summary.percentage}%</strong>
                </div>
                <div className="attendance-card">
                    <h3>Total Classes</h3>
                    <strong className="large-number">{summary.totalClasses}</strong>
                </div>
                <div className="attendance-card">
                    <h3>Present</h3>
                    <strong className="status-present-number">{summary.presentClasses}</strong>
                </div>
                <div className="attendance-card">
                    <h3>Absent</h3>
                    <strong className="status-absent-number">{summary.absentClasses}</strong>
                </div>
                <div className="attendance-card">
                    <h3>Late</h3>
                    <strong className="status-late-number">{summary.lateClasses}</strong>
                </div>
            </div>

            {/* OVERALL ATTENDANCE VISUALIZATION */}
            <div className="attendance-table-card">
                <h2>Overall Attendance Breakdown</h2>
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* COURSE-WISE ATTENDANCE */}
            <div className="attendance-table-card">
                <div className="page-header">
                    <div>
                        <h2>Course-Wise Attendance</h2>
                        <p>Attendance summary by course</p>
                    </div>
                </div>

                {courseSummary.length > 0 && (
                    <div className="course-chart-container">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={courseChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Present" stackId="a" fill="#10b981" />
                                <Bar dataKey="Absent" stackId="a" fill="#ef4444" />
                                <Bar dataKey="Late" stackId="a" fill="#f59e0b" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                <table>
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Total</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Late</th>
                            <th>Percentage</th>
                            <th>Progress</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courseSummary.length === 0 ? (
                            <tr>
                                <td colSpan="7">No attendance records found.</td>
                            </tr>
                        ) : (
                            courseSummary.map((course) => (
                                <tr key={course.courseId}>
                                    <td>
                                        <strong>{course.courseCode}</strong>
                                        <br />
                                        <small>{course.courseName}</small>
                                    </td>
                                    <td>{course.total}</td>
                                    <td className="status-present-number">{course.present}</td>
                                    <td className="status-absent-number">{course.absent}</td>
                                    <td className="status-late-number">{course.late}</td>
                                    <td>
                                        <strong>{course.percentage}%</strong>
                                    </td>
                                    <td>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width: `${course.percentage}%`,
                                                    backgroundColor: course.percentage >= 75 ? "#10b981" : "#ef4444"
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* FILTERS & SEARCH */}
            <div className="attendance-table-card">
                <h2>Attendance History</h2>
                <div className="filters-container">
                    <div className="filter-group">
                        <label>Search:</label>
                        <input
                            type="text"
                            placeholder="Search by course code, name, or status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="filter-input"
                        />
                    </div>
                    <div className="filter-group">
                        <label>Course:</label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Courses</option>
                            {courseOptions.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.code} - {course.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Status:</label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Status</option>
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Sort By:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select"
                        >
                            <option value="date-desc">Date (Newest First)</option>
                            <option value="date-asc">Date (Oldest First)</option>
                            <option value="course">Course Code</option>
                        </select>
                    </div>
                </div>

                {/* ATTENDANCE HISTORY TABLE */}
                <div className="records-info">
                    Showing {filteredAttendance.length} of {attendance.length} records
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Course Code</th>
                            <th>Course Name</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAttendance.length === 0 ? (
                            <tr>
                                <td colSpan="4">No attendance records match your filters.</td>
                            </tr>
                        ) : (
                            filteredAttendance.map((record) => (
                                <tr key={record.AttendanceId}>
                                    <td>
                                        {new Date(record.AttendanceDate).toLocaleDateString()}
                                    </td>
                                    <td>{record.CourseCode || `Course ${record.CourseId}`}</td>
                                    <td>{record.CourseName || "Course"}</td>
                                    <td>
                                        <span
                                            className={
                                                record.Status?.toLowerCase() === "present"
                                                    ? "status-present"
                                                    : record.Status?.toLowerCase() === "late"
                                                    ? "status-late"
                                                    : "status-absent"
                                            }
                                        >
                                            {record.Status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Attendance;
