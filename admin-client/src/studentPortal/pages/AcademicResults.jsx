import { useEffect, useState } from "react";
import { getStudentData } from "../api/studentApi";

const resultsData = [
    {
        code: "CS501",
        subject: "Database Management System",
        internal: 24,
        external: 62,
        total: 86,
        grade: "A",
        gradePoint: 9
    },
    {
        code: "CS502",
        subject: "React Development",
        internal: 26,
        external: 65,
        total: 91,
        grade: "A+",
        gradePoint: 10
    },
    {
        code: "CS503",
        subject: "Computer Networks",
        internal: 23,
        external: 58,
        total: 81,
        grade: "A",
        gradePoint: 9
    },
    {
        code: "CS504",
        subject: "Operating Systems",
        internal: 21,
        external: 55,
        total: 76,
        grade: "B+",
        gradePoint: 8
    },
    {
        code: "CS505",
        subject: "Software Engineering",
        internal: 25,
        external: 60,
        total: 85,
        grade: "A",
        gradePoint: 9
    },
    {
        code: "CS506",
        subject: "Professional Elective",
        internal: 24,
        external: 57,
        total: 81,
        grade: "A",
        gradePoint: 9
    }
];


const AcademicResults = () => {
    const [liveResults, setLiveResults] = useState([]);
    useEffect(() => {
        getStudentData("/results").then(({ results }) => setLiveResults(results.map(result => {
            const total = Number(result.MarksObtained || 0);
            const percentage = Number(result.Percentage || 0);
            return { code: result.CourseCode, subject: result.CourseName, internal: total, external: 0, total,
                percentage,
                grade: percentage >= 90 ? "A+" : percentage >= 75 ? "A" : percentage >= 60 ? "B+" : percentage >= 50 ? "B" : "F",
                gradePoint: percentage >= 90 ? 10 : percentage >= 75 ? 9 : percentage >= 60 ? 8 : percentage >= 50 ? 7 : 0 };
        }))).catch(console.error);
    }, []);
    const resultsData = liveResults;

    const averageMarks = resultsData.length
        ? Math.round(resultsData.reduce((total, result) => total + result.percentage, 0) / resultsData.length)
        : 0;

    const passedSubjects = resultsData.filter(
        (result) => result.percentage >= 50
    ).length;


    return (
        <main className="dashboard-content results-page">

            {/* PAGE HEADER */}

            <div className="page-header">

                <div>

                    <h1>
                        Academic Results
                    </h1>

                    <p>
                        View your examination results and academic performance
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


            {/* RESULT SUMMARY */}

            <section className="result-metrics">

                <div className="result-metric">

                    <span className="result-label">
                        Current CGPA
                    </span>

                    <strong>
                        8.6
                    </strong>

                    <small>
                        Overall CGPA
                    </small>

                </div>


                <div className="result-metric">

                    <span className="result-label">
                        Semester GPA
                    </span>

                    <strong>
                        8.9
                    </strong>

                    <small>
                        Current semester
                    </small>

                </div>


                <div className="result-metric">

                    <span className="result-label">
                        Average Marks
                    </span>

                    <strong>
                        {averageMarks}%
                    </strong>

                    <small>
                        Across all subjects
                    </small>

                </div>


                <div className="result-metric">

                    <span className="result-label">
                        Subjects Passed
                    </span>

                    <strong>
                        {passedSubjects}/{resultsData.length}
                    </strong>

                    <small>
                        Current semester
                    </small>

                </div>

            </section>


            {/* RESULTS TABLE */}

            <section className="results-card">

                <div className="results-card-header">

                    <div>

                        <h3>
                            Semester Results
                        </h3>

                        <p>
                            Detailed marks and grades for Semester 5
                        </p>

                    </div>

                    <span className="result-status">
                        Published
                    </span>

                </div>


                <div className="results-table-wrapper">

                    <table className="results-table">

                        <thead>

                            <tr>

                                <th>
                                    Subject
                                </th>

                                <th>
                                    Code
                                </th>

                                <th>
                                    Internal
                                </th>

                                <th>
                                    External
                                </th>

                                <th>
                                    Total
                                </th>

                                <th>
                                    Grade
                                </th>

                                <th>
                                    Grade Point
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {resultsData.map((result) => (

                                <tr key={result.code}>

                                    <td>

                                        <div className="result-subject">

                                            <div className="result-subject-icon">
                                                {result.subject.charAt(0)}
                                            </div>

                                            <strong>
                                                {result.subject}
                                            </strong>

                                        </div>

                                    </td>


                                    <td>

                                        <span className="result-code">
                                            {result.code}
                                        </span>

                                    </td>


                                    <td>
                                        {result.internal}
                                    </td>


                                    <td>
                                        {result.external}
                                    </td>


                                    <td>

                                        <strong className="total-mark">
                                            {result.total}
                                        </strong>

                                    </td>


                                    <td>

                                        <span
                                            className={
                                                result.grade === "A+"
                                                    ? "grade-badge excellent"
                                                    : "grade-badge"
                                            }
                                        >
                                            {result.grade}
                                        </span>

                                    </td>


                                    <td>

                                        <strong>
                                            {result.gradePoint}
                                        </strong>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </section>


            {/* PERFORMANCE NOTE */}

            <div className="results-note">

                <strong>
                    Academic Performance
                </strong>

                <span>
                    Your current semester performance is above average.
                </span>

            </div>

        </main>
    );
};


export default AcademicResults;
