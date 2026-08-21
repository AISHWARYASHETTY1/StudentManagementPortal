import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AttendanceChart from "../components/dashboard/AttendanceChart";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import { getStudentData } from "../api/studentApi";


const Dashboard = ({ student }) => {
    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                setLoading(true);
                setError("");

                const data = await getStudentData("/dashboard");

                setDashboardData(data);

            } catch (error) {

                console.error(
                    "Dashboard error:",
                    error
                );

                setError(error.message);

            } finally {

                setLoading(false);

            }

        };


        if (student) {
    fetchDashboardData();
}

    }, [student]);


    if (loading) {

        return (
            <main className="dashboard-content">
                <p>Loading dashboard...</p>
            </main>
        );

    }


    if (error) {

        return (
            <main className="dashboard-content">
                <p className="error-message">
                    {error}
                </p>
            </main>
        );

    }


    if (!dashboardData) {
        return null;
    }


    const {
        summary,
        attendance,
        courses,
        marks
    } = dashboardData;


    return (

        <main className="dashboard-content">


            {/* WELCOME */}

            <section className="welcome-section">

                <h1>
                    Welcome back,{" "}
                    {student?.FirstName || "Student"}
                </h1>

                <p>
                    {student?.Course || "Student"} •{" "}
                    {student?.Department || "Department"}
                </p>

            </section>



            {/* METRICS */}

            <section className="academic-overview">

                <div className="section-heading">

                    <div>

                        <h2>
                            Academic Overview
                        </h2>

                    </div>


                    <select className="semester-selector">

                        <option>
                            Current Semester
                        </option>

                    </select>

                </div>


                <div className="metrics-grid">

                    {/* ATTENDANCE */}

                    <div 
                        className="metric-card"
                        onClick={() => navigate("/attendance")}
                        style={{ cursor: "pointer" }}
                    >

                        <div className="metric-card-header">

                            <span className="metric-title">
                                Attendance
                            </span>

                        </div>

                        <div className="metric-value">

                            {summary.attendance}%

                        </div>

                        <div className="metric-subtitle">

                            Overall attendance

                        </div>

                    </div>

                    {/* ACADEMIC PERFORMANCE */}

                    <div 
                        className="metric-card"
                        onClick={() => navigate("/results")}
                        style={{ cursor: "pointer" }}
                    >

                        <div className="metric-card-header">

                            <span className="metric-title">
                                Academic Performance
                            </span>

                        </div>

                        <div className="metric-value">

                            {summary.academicPerformance}%

                        </div>

                        <div className="metric-subtitle">

                            Based on examination marks

                        </div>

                    </div>



                    {/* CREDITS */}

                    <div 
                        className="metric-card"
                        onClick={() => navigate("/courses")}
                        style={{ cursor: "pointer" }}
                    >

                        <div className="metric-card-header">

                            <span className="metric-title">
                                Credits
                            </span>

                        </div>

                        <div className="metric-value">

                            {summary.totalCredits}

                        </div>

                        <div className="metric-subtitle">

                            Total enrolled credits

                        </div>

                    </div>



                    {/* COURSES */}

                    <div 
                        className="metric-card"
                        onClick={() => navigate("/courses")}
                        style={{ cursor: "pointer" }}
                    >

                        <div className="metric-card-header">

                            <span className="metric-title">
                                Courses
                            </span>

                        </div>

                        <div className="metric-value">

                            {summary.totalCourses}

                        </div>

                        <div className="metric-subtitle">

                            Currently enrolled courses

                        </div>

                    </div>

                </div>

            </section>



            {/* CHARTS */}

            <section className="charts-section">

                <AttendanceChart
                    attendance={attendance}
                />

                <PerformanceChart
                    marks={marks}
                />

            </section>



            {/* LOWER SECTION */}

            <section className="dashboard-information">


                {/* COURSES */}

                <div className="information-card">

                    <div className="information-header">

                        <div>

                            <h3>
                                My Courses
                            </h3>

                            <p>
                                Currently enrolled courses
                            </p>

                        </div>

                    </div>


                    {courses.slice(0, 3).map(
                        (course) => (

                            <div
                                className="timetable-item"
                                key={course.CourseId}
                                onClick={() => navigate("/courses")}
                                style={{ cursor: "pointer" }}
                            >

                                <div className="time">
                                    {course.CourseCode}
                                </div>


                                <div className="class-details">

                                    <h4>
                                        {course.CourseName}
                                    </h4>

                                    <p>
                                        {course.Credits} Credits
                                    </p>

                                </div>

                            </div>

                        )
                    )}


                    {courses.length === 0 && (

                        <p>
                            No courses found.
                        </p>

                    )}

                </div>



                {/* RECENT RESULTS */}

                <div className="information-card">

                    <div className="information-header">

                        <div>

                            <h3>
                                Recent Results
                            </h3>

                            <p>
                                Latest examination results
                            </p>

                        </div>

                    </div>


                    {marks.slice(0, 3).map(
                        (mark) => (

                            <div
                                className="exam-item"
                                key={mark.MarkId}
                                onClick={() => navigate("/results")}
                                style={{ cursor: "pointer" }}
                            >

                                <div className="exam-date">

                                    <span>
                                        {Number(
                                            mark.MarksObtained
                                        ).toFixed(0)}
                                    </span>

                                    <small>
                                        / {Number(
                                            mark.MaxMarks
                                        ).toFixed(0)}
                                    </small>

                                </div>


                                <div className="exam-details">

                                    <h4>
                                        {mark.CourseName}
                                    </h4>

                                    <p>
                                        {mark.ExamType}
                                    </p>

                                </div>

                            </div>

                        )
                    )}


                    {marks.length === 0 && (

                        <p>
                            No examination results found.
                        </p>

                    )}

                </div>


            </section>
            <section className="recent-activity-section">

    <div className="activity-card">

        <div className="activity-header">

            <div>

                <h3>Recent Academic Activity</h3>

                <p>
                    Your latest academic updates
                </p>

            </div>

            <button 
                className="view-all-btn"
                onClick={() => navigate("/results")}
            >
                View All
            </button>

        </div>
        <div className="activity-list">


            <div className="activity-item">

                <div className="activity-icon">
                    ✓
                </div>

                <div className="activity-details">

                    <h4>
                        Assignment Submitted
                    </h4>

                    <p>
                        Database Management Systems
                    </p>

                </div>

                <span className="activity-time">
                    Today
                </span>

            </div>


            <div className="activity-item">

                <div className="activity-icon">
                    ★
                </div>

                <div className="activity-details">

                    <h4>
                        Examination Result Published
                    </h4>

                    <p>
                        Mathematics - Grade A
                    </p>

                </div>

                <span className="activity-time">
                    Yesterday
                </span>

            </div>


            <div className="activity-item">

                <div className="activity-icon">
                    ✓
                </div>

                <div className="activity-details">

                    <h4>
                        Attendance Updated
                    </h4>

                    <p>
                        Current attendance is 90%
                    </p>

                </div>

                <span className="activity-time">
                    2 days ago
                </span>

            </div>


            <div className="activity-item">

                <div className="activity-icon">
                    ₹
                </div>

                <div className="activity-details">

                    <h4>
                        Fee Payment Received
                    </h4>

                    <p>
                        Semester tuition fee payment
                    </p>

                </div>

                <span className="activity-time">
                    5 days ago
                </span>

            </div>


        </div>

    </div>

</section>


        </main>

    );

};


export default Dashboard;
