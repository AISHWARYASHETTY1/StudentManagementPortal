import { useState } from "react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";

const Attendance = () => {

    const [selectedSubject, setSelectedSubject] = useState(null);
    const [semester, setSemester] = useState("Current Semester");

    // Temporary data.
    // Later we will replace this with your SQL Server API data.
    const attendanceData = [
        {
            subject: "Data Structures",
            code: "CS301",
            present: 28,
            absent: 2,
            total: 30
        },
        {
            subject: "Database Systems",
            code: "CS302",
            present: 25,
            absent: 5,
            total: 30
        },
        {
            subject: "Operating Systems",
            code: "CS303",
            present: 22,
            absent: 8,
            total: 30
        },
        {
            subject: "Computer Networks",
            code: "CS304",
            present: 27,
            absent: 3,
            total: 30
        }
    ];

    const totalClasses = attendanceData.reduce(
        (sum, subject) => sum + subject.total,
        0
    );

    const presentClasses = attendanceData.reduce(
        (sum, subject) => sum + subject.present,
        0
    );

    const absentClasses = attendanceData.reduce(
        (sum, subject) => sum + subject.absent,
        0
    );

    const overallPercentage =
        totalClasses > 0
            ? Math.round((presentClasses / totalClasses) * 100)
            : 0;

    const pieData = [
        {
            name: "Present",
            value: presentClasses
        },
        {
            name: "Absent",
            value: absentClasses
        }
    ];

    const COLORS = ["#4f46e5", "#e5e7eb"];

    const barData = attendanceData.map((subject) => ({
        name: subject.code,
        percentage: Math.round(
            (subject.present / subject.total) * 100
        )
    }));

    const getPercentage = (subject) => {
        return Math.round(
            (subject.present / subject.total) * 100
        );
    };

    const getStatus = (percentage) => {
        if (percentage >= 75) {
            return "Good";
        }

        return "Warning";
    };

    return (
        <div className="attendance-page">

            {/* PAGE HEADER */}

            <div className="page-header">

                <div>
                    <h1>Attendance</h1>

                    <p>
                        Track your attendance and subject-wise
                        participation
                    </p>
                </div>

                <select
                    className="page-selector"
                    value={semester}
                    onChange={(event) =>
                        setSemester(event.target.value)
                    }
                >
                    <option>
                        Current Semester
                    </option>

                    <option>
                        Previous Semester
                    </option>
                </select>

            </div>


            {/* METRICS */}

            <div className="attendance-metrics">

                <div className="attendance-metric">

                    <span>
                        Overall Attendance
                    </span>

                    <strong>
                        {overallPercentage}%
                    </strong>

                    <small>
                        Current semester
                    </small>

                </div>


                <div className="attendance-metric">

                    <span>
                        Present Classes
                    </span>

                    <strong>
                        {presentClasses}
                    </strong>

                    <small>
                        Classes attended
                    </small>

                </div>


                <div className="attendance-metric">

                    <span>
                        Absent Classes
                    </span>

                    <strong>
                        {absentClasses}
                    </strong>

                    <small>
                        Classes missed
                    </small>

                </div>


                <div className="attendance-metric">

                    <span>
                        Total Classes
                    </span>

                    <strong>
                        {totalClasses}
                    </strong>

                    <small>
                        Classes conducted
                    </small>

                </div>

            </div>


            {/* CHARTS */}

            <div className="attendance-charts">

                {/* PIE CHART */}

                <div className="attendance-card">

                    <div className="attendance-card-header">

                        <div>

                            <h3>
                                Attendance Overview
                            </h3>

                            <p>
                                Overall attendance status
                            </p>

                        </div>

                    </div>


                    <div className="attendance-pie">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <PieChart>

                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={78}
                                    paddingAngle={3}
                                >

                                    {pieData.map(
                                        (entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index]}
                                            />
                                        )
                                    )}

                                </Pie>

                                <Tooltip />

                                <Legend />

                            </PieChart>

                        </ResponsiveContainer>


                        <div className="attendance-pie-center">

                            <strong>
                                {overallPercentage}%
                            </strong>

                            <span>
                                Attendance
                            </span>

                        </div>

                    </div>

                </div>


                {/* BAR CHART */}

                <div className="attendance-card">

                    <div className="attendance-card-header">

                        <div>

                            <h3>
                                Subject-wise Attendance
                            </h3>

                            <p>
                                Attendance percentage by subject
                            </p>

                        </div>

                    </div>


                    <div className="attendance-bar">

                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >

                            <BarChart
                                data={barData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -20,
                                    bottom: 5
                                }}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                />

                                <XAxis
                                    dataKey="name"
                                    fontSize={8}
                                />

                                <YAxis
                                    domain={[0, 100]}
                                    fontSize={8}
                                />

                                <Tooltip
                                    formatter={(value) => [
                                        `${value}%`,
                                        "Attendance"
                                    ]}
                                />

                                <Bar
                                    dataKey="percentage"
                                    fill="#4f46e5"
                                    radius={[4, 4, 0, 0]}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            </div>


            {/* ATTENDANCE TABLE */}

            <div className="attendance-table-card">

                <div className="attendance-card-header">

                    <div>

                        <h3>
                            Subject Attendance
                        </h3>

                        <p>
                            Click a subject to view details
                        </p>

                    </div>

                </div>


                <div className="attendance-table-wrapper">

                    <table className="attendance-table">

                        <thead>

                            <tr>

                                <th>
                                    Subject
                                </th>

                                <th>
                                    Present
                                </th>

                                <th>
                                    Absent
                                </th>

                                <th>
                                    Total
                                </th>

                                <th>
                                    Attendance
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {attendanceData.map(
                                (subject) => {

                                    const percentage =
                                        getPercentage(subject);

                                    return (

                                        <tr
                                            key={subject.code}
                                            onClick={() =>
                                                setSelectedSubject(
                                                    subject
                                                )
                                            }
                                            style={{
                                                cursor: "pointer"
                                            }}
                                        >

                                            <td>

                                                <strong>
                                                    {subject.subject}
                                                </strong>

                                                <br />

                                                <small>
                                                    {subject.code}
                                                </small>

                                            </td>

                                            <td>
                                                {subject.present}
                                            </td>

                                            <td>
                                                {subject.absent}
                                            </td>

                                            <td>
                                                {subject.total}
                                            </td>

                                            <td>

                                                <div className="attendance-value">

                                                    <span>
                                                        {percentage}%
                                                    </span>

                                                    <div className="attendance-progress">

                                                        <div
                                                            style={{
                                                                width: `${percentage}%`
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                            </td>

                                            <td>

                                                <span
                                                    className={`attendance-status ${
                                                        percentage >= 75
                                                            ? "good"
                                                            : "warning"
                                                    }`}
                                                >
                                                    {getStatus(
                                                        percentage
                                                    )}
                                                </span>

                                            </td>

                                        </tr>

                                    );

                                }
                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* SELECTED SUBJECT */}

            {selectedSubject && (

                <div
                    className="attendance-card"
                    style={{
                        marginTop: "10px"
                    }}
                >

                    <div className="attendance-card-header">

                        <div>

                            <h3>
                                {selectedSubject.subject}
                            </h3>

                            <p>
                                {selectedSubject.code}
                            </p>

                        </div>

                        <button
                            className="view-all-btn"
                            onClick={() =>
                                setSelectedSubject(null)
                            }
                        >
                            Close
                        </button>

                    </div>


                    <div className="details-grid">

                        <div className="detail-item">

                            <span>
                                Present Classes
                            </span>

                            <strong>
                                {selectedSubject.present}
                            </strong>

                        </div>


                        <div className="detail-item">

                            <span>
                                Absent Classes
                            </span>

                            <strong>
                                {selectedSubject.absent}
                            </strong>

                        </div>


                        <div className="detail-item">

                            <span>
                                Total Classes
                            </span>

                            <strong>
                                {selectedSubject.total}
                            </strong>

                        </div>


                        <div className="detail-item">

                            <span>
                                Attendance
                            </span>

                            <strong>
                                {getPercentage(
                                    selectedSubject
                                )}%
                            </strong>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Attendance;