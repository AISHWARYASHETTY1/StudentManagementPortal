import { useEffect, useState } from "react";
import { getStudentData } from "../api/studentApi";

const timetable = [
    {
        day: "Monday",
        date: "17 Aug",
        classes: [
            {
                time: "10:00 AM",
                subject: "Database Management System",
                code: "CS501",
                faculty: "Prof. Kumar",
                room: "Room 204",
                type: "Lecture"
            },
            {
                time: "12:00 PM",
                subject: "React Development",
                code: "CS502",
                faculty: "Prof. Arun",
                room: "Lab 3",
                type: "Lab"
            },
            {
                time: "02:00 PM",
                subject: "Computer Networks",
                code: "CS503",
                faculty: "Prof. Priya",
                room: "Room 301",
                type: "Lecture"
            }
        ]
    },
    {
        day: "Tuesday",
        date: "18 Aug",
        classes: [
            {
                time: "09:00 AM",
                subject: "Operating Systems",
                code: "CS504",
                faculty: "Prof. Rajesh",
                room: "Room 202",
                type: "Lecture"
            },
            {
                time: "11:00 AM",
                subject: "Software Engineering",
                code: "CS505",
                faculty: "Prof. Meena",
                room: "Room 205",
                type: "Lecture"
            },
            {
                time: "02:00 PM",
                subject: "React Development",
                code: "CS502",
                faculty: "Prof. Arun",
                room: "Lab 3",
                type: "Lab"
            }
        ]
    },
    {
        day: "Wednesday",
        date: "19 Aug",
        classes: [
            {
                time: "10:00 AM",
                subject: "Computer Networks",
                code: "CS503",
                faculty: "Prof. Priya",
                room: "Room 301",
                type: "Lecture"
            },
            {
                time: "12:00 PM",
                subject: "Database Management System",
                code: "CS501",
                faculty: "Prof. Kumar",
                room: "Room 204",
                type: "Lecture"
            },
            {
                time: "03:00 PM",
                subject: "Professional Elective",
                code: "CS506",
                faculty: "Prof. Anitha",
                room: "Room 106",
                type: "Elective"
            }
        ]
    },
    {
        day: "Thursday",
        date: "20 Aug",
        classes: [
            {
                time: "09:00 AM",
                subject: "Software Engineering",
                code: "CS505",
                faculty: "Prof. Meena",
                room: "Room 205",
                type: "Lecture"
            },
            {
                time: "11:00 AM",
                subject: "Operating Systems",
                code: "CS504",
                faculty: "Prof. Rajesh",
                room: "Room 202",
                type: "Lecture"
            },
            {
                time: "02:00 PM",
                subject: "Database Management System",
                code: "CS501",
                faculty: "Prof. Kumar",
                room: "Lab 2",
                type: "Lab"
            }
        ]
    },
    {
        day: "Friday",
        date: "21 Aug",
        classes: [
            {
                time: "10:00 AM",
                subject: "React Development",
                code: "CS502",
                faculty: "Prof. Arun",
                room: "Lab 3",
                type: "Lab"
            },
            {
                time: "12:00 PM",
                subject: "Computer Networks",
                code: "CS503",
                faculty: "Prof. Priya",
                room: "Room 301",
                type: "Lecture"
            },
            {
                time: "02:00 PM",
                subject: "Professional Elective",
                code: "CS506",
                faculty: "Prof. Anitha",
                room: "Room 106",
                type: "Elective"
            }
        ]
    }
];


const ClassTimetable = () => {
    const [liveTimetable, setLiveTimetable] = useState([]);
    useEffect(() => {
        getStudentData("/timetable").then(({ timetable: records }) => {
            const grouped = records.reduce((days, record) => {
                const day = record.Day || "Schedule";
                if (!days[day]) days[day] = { day, date: "", classes: [] };
                days[day].classes.push({ time: `${record.StartTime} - ${record.EndTime}`, subject: record.CourseName,
                    code: record.CourseCode, faculty: record.Faculty || "-", room: record.Room || "-", type: "Class" });
                return days;
            }, {});
            setLiveTimetable(Object.values(grouped));
        }).catch(console.error);
    }, []);
    const timetable = liveTimetable;

    return (
        <main className="dashboard-content timetable-page">

            <div className="page-header">

                <div>

                    <h1>
                        Class Timetable
                    </h1>

                    <p>
                        Your weekly class schedule
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


            <section className="timetable-card">

                <div className="timetable-card-header">

                    <div>

                        <h3>
                            Weekly Schedule
                        </h3>

                        <p>
                            Monday to Friday class timings
                        </p>

                    </div>

                    <span className="current-week">
                        Current Week
                    </span>

                </div>


                <div className="weekly-timetable">

                    {timetable.map((day) => (

                        <div
                            className="day-column"
                            key={day.day}
                        >

                            <div className="day-header">

                                <strong>
                                    {day.day}
                                </strong>

                                <span>
                                    {day.date}
                                </span>

                            </div>


                            <div className="day-classes">

                                {day.classes.map((item, index) => (

                                    <div
                                        className="class-card"
                                        key={`${day.day}-${index}`}
                                    >

                                        <div className="class-time">
                                            {item.time}
                                        </div>


                                        <div className="class-subject">
                                            {item.subject}
                                        </div>


                                        <div className="class-code">
                                            {item.code}
                                        </div>


                                        <div className="class-info">
                                            {item.faculty}
                                        </div>


                                        <div className="class-footer">

                                            <span>
                                                {item.room}
                                            </span>

                                            <span
                                                className={
                                                    item.type === "Lab"
                                                        ? "class-type lab"
                                                        : item.type === "Elective"
                                                            ? "class-type elective"
                                                            : "class-type"
                                                }
                                            >
                                                {item.type}
                                            </span>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>

                    ))}

                </div>

            </section>

        </main>
    );
};


export default ClassTimetable;
