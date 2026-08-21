import { useEffect, useState } from "react";
import { getStudentData } from "../api/studentApi";

const courseData = [
    {
        code: "CS501",
        name: "Database Management System",
        faculty: "Prof. Kumar",
        credits: 4,
        type: "Core",
        status: "Ongoing"
    },
    {
        code: "CS502",
        name: "React Development",
        faculty: "Prof. Arun",
        credits: 4,
        type: "Core",
        status: "Ongoing"
    },
    {
        code: "CS503",
        name: "Computer Networks",
        faculty: "Prof. Priya",
        credits: 4,
        type: "Core",
        status: "Ongoing"
    },
    {
        code: "CS504",
        name: "Operating Systems",
        faculty: "Prof. Rajesh",
        credits: 4,
        type: "Core",
        status: "Ongoing"
    },
    {
        code: "CS505",
        name: "Software Engineering",
        faculty: "Prof. Meena",
        credits: 3,
        type: "Core",
        status: "Ongoing"
    },
    {
        code: "CS506",
        name: "Professional Elective",
        faculty: "Prof. Anitha",
        credits: 3,
        type: "Elective",
        status: "Ongoing"
    }
];


const Courses = () => {
    const [liveCourses, setLiveCourses] = useState([]);
    useEffect(() => {
        getStudentData("/courses").then(({ courses }) => setLiveCourses(courses.map(course => ({
            code: course.CourseCode, name: course.CourseName, faculty: "-", credits: Number(course.Credits || 0),
            type: "Course", status: course.Status || "Active"
        })))).catch(console.error);
    }, []);
    const courseData = liveCourses;

    const totalCredits = courseData.reduce(
        (total, course) => total + course.credits,
        0
    );

    const coreCourses = courseData.filter(
        (course) => course.type === "Core"
    ).length;

    const electiveCourses = courseData.filter(
        (course) => course.type === "Elective"
    ).length;


    return (
        <main className="dashboard-content courses-page">

            {/* HEADER */}

            <div className="page-header">

                <div>

                    <h1>
                        Courses
                    </h1>

                    <p>
                        Courses enrolled for the current semester
                    </p>

                </div>


                <select className="page-selector">

                    <option>
                        Semester 5
                    </option>

                    <option>
                        Semester 4
                    </option>

                    <option>
                        Semester 3
                    </option>

                </select>

            </div>


            {/* SUMMARY */}

            <section className="course-metrics">

                <div className="course-metric">

                    <div className="course-metric-icon">
                        📚
                    </div>

                    <div>

                        <span>
                            Total Courses
                        </span>

                        <strong>
                            {courseData.length}
                        </strong>

                    </div>

                </div>


                <div className="course-metric">

                    <div className="course-metric-icon">
                        🎓
                    </div>

                    <div>

                        <span>
                            Total Credits
                        </span>

                        <strong>
                            {totalCredits}
                        </strong>

                    </div>

                </div>


                <div className="course-metric">

                    <div className="course-metric-icon">
                        ✓
                    </div>

                    <div>

                        <span>
                            Core Courses
                        </span>

                        <strong>
                            {coreCourses}
                        </strong>

                    </div>

                </div>


                <div className="course-metric">

                    <div className="course-metric-icon">
                        ☆
                    </div>

                    <div>

                        <span>
                            Electives
                        </span>

                        <strong>
                            {electiveCourses}
                        </strong>

                    </div>

                </div>

            </section>


            {/* COURSE TABLE */}

            <section className="courses-card">

                <div className="courses-card-header">

                    <div>

                        <h3>
                            Enrolled Courses
                        </h3>

                        <p>
                            Your subjects and course information
                        </p>

                    </div>


                    <span className="course-count">
                        {courseData.length} Courses
                    </span>

                </div>


                <div className="courses-table-wrapper">

                    <table className="courses-table">

                        <thead>

                            <tr>

                                <th>
                                    Course
                                </th>

                                <th>
                                    Course Code
                                </th>

                                <th>
                                    Faculty
                                </th>

                                <th>
                                    Credits
                                </th>

                                <th>
                                    Type
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {courseData.map((course) => (

                                <tr key={course.code}>

                                    <td>

                                        <div className="course-name">

                                            <div className="course-icon">
                                                {course.code.substring(2, 3)}
                                            </div>

                                            <strong>
                                                {course.name}
                                            </strong>

                                        </div>

                                    </td>


                                    <td>
                                        <span className="course-code">
                                            {course.code}
                                        </span>
                                    </td>


                                    <td>
                                        {course.faculty}
                                    </td>


                                    <td>
                                        {course.credits}
                                    </td>


                                    <td>

                                        <span
                                            className={
                                                course.type === "Core"
                                                    ? "course-type core"
                                                    : "course-type elective"
                                            }
                                        >
                                            {course.type}
                                        </span>

                                    </td>


                                    <td>

                                        <span className="course-status">
                                            <span className="status-dot"></span>
                                            {course.status}
                                        </span>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </section>

        </main>
    );
};


export default Courses;
