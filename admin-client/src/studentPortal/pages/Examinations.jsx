import { useEffect, useState } from "react";
import { getStudentData } from "../api/studentApi";

const examData = [
    {
        date: "18",
        month: "AUG",
        day: "Monday",
        subject: "Mathematics",
        code: "MA501",
        time: "10:00 AM - 1:00 PM",
        venue: "Main Examination Hall",
        type: "End Semester"
    },
    {
        date: "21",
        month: "AUG",
        day: "Thursday",
        subject: "Database Management System",
        code: "CS501",
        time: "10:00 AM - 1:00 PM",
        venue: "Room 204",
        type: "End Semester"
    },
    {
        date: "25",
        month: "AUG",
        day: "Monday",
        subject: "Computer Networks",
        code: "CS503",
        time: "02:00 PM - 5:00 PM",
        venue: "Main Examination Hall",
        type: "End Semester"
    },
    {
        date: "28",
        month: "AUG",
        day: "Thursday",
        subject: "Operating Systems",
        code: "CS504",
        time: "10:00 AM - 1:00 PM",
        venue: "Room 202",
        type: "End Semester"
    },
    {
        date: "01",
        month: "SEP",
        day: "Monday",
        subject: "Software Engineering",
        code: "CS505",
        time: "02:00 PM - 5:00 PM",
        venue: "Room 205",
        type: "End Semester"
    }
];


const Examinations = () => {
    const [liveExams, setLiveExams] = useState([]);
    useEffect(() => {
        getStudentData("/exams").then(({ exams }) => setLiveExams(exams.map(exam => {
            const date = new Date(exam.ExamDate);
            return { date: String(date.getDate()).padStart(2, "0"), month: date.toLocaleString("en", { month: "short" }).toUpperCase(),
                day: date.toLocaleString("en", { weekday: "long" }), subject: exam.CourseName, code: exam.CourseCode,
                time: exam.ExamTime || "", venue: exam.Venue || "-", type: exam.ExamType };
        }))).catch(console.error);
    }, []);
    const examData = liveExams;

    return (
        <main className="dashboard-content examinations-page">

            {/* HEADER */}

            <div className="page-header">

                <div>

                    <h1>
                        Examinations
                    </h1>

                    <p>
                        View your upcoming and scheduled examinations
                    </p>

                </div>


                <select className="page-selector">

                    <option>
                        Semester 5
                    </option>

                    <option>
                        Semester 4
                    </option>

                </select>

            </div>


            {/* SUMMARY */}

            <section className="exam-metrics">

                <div className="exam-metric">

                    <div className="exam-metric-icon">
                        📅
                    </div>

                    <div>

                        <span>
                            Upcoming Exams
                        </span>

                        <strong>
                            {examData.length}
                        </strong>

                    </div>

                </div>


                <div className="exam-metric">

                    <div className="exam-metric-icon">
                        ⏱
                    </div>

                    <div>

                        <span>
                            Next Exam
                        </span>

                        <strong>
                            18 Aug
                        </strong>

                    </div>

                </div>


                <div className="exam-metric">

                    <div className="exam-metric-icon">
                        📚
                    </div>

                    <div>

                        <span>
                            Subjects
                        </span>

                        <strong>
                            5
                        </strong>

                    </div>

                </div>


                <div className="exam-metric">

                    <div className="exam-metric-icon">
                        ✓
                    </div>

                    <div>

                        <span>
                            Exam Status
                        </span>

                        <strong className="exam-ready">
                            Ready
                        </strong>

                    </div>

                </div>

            </section>


            {/* EXAMINATION LIST */}

            <section className="examinations-card">

                <div className="examinations-card-header">

                    <div>

                        <h3>
                            Examination Schedule
                        </h3>

                        <p>
                            Your upcoming semester examinations
                        </p>

                    </div>

                    <span className="schedule-status">
                        Published
                    </span>

                </div>


                <div className="exam-list">

                    {examData.map((exam) => (

                        <div
                            className="exam-row"
                            key={exam.code}
                        >

                            {/* DATE */}

                            <div className="exam-calendar">

                                <strong>
                                    {exam.date}
                                </strong>

                                <span>
                                    {exam.month}
                                </span>

                            </div>


                            {/* SUBJECT */}

                            <div className="exam-subject">

                                <strong>
                                    {exam.subject}
                                </strong>

                                <span>
                                    {exam.code} • {exam.type}
                                </span>

                            </div>


                            {/* TIME */}

                            <div className="exam-column">

                                <small>
                                    DATE & TIME
                                </small>

                                <span>
                                    {exam.day}, {exam.time}
                                </span>

                            </div>


                            {/* VENUE */}

                            <div className="exam-column">

                                <small>
                                    VENUE
                                </small>

                                <span>
                                    {exam.venue}
                                </span>

                            </div>


                            {/* STATUS */}

                            <div className="exam-scheduled">

                                <span className="scheduled-dot"></span>

                                Scheduled

                            </div>

                        </div>

                    ))}

                </div>

            </section>


            {/* EXAM NOTE */}

            <div className="exam-note">

                <strong>
                    Examination Reminder
                </strong>

                <span>
                    Please carry your student ID card and examination hall ticket.
                </span>

            </div>

        </main>
    );
};


export default Examinations;
