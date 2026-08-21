import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip
} from "recharts";
import { useNavigate } from "react-router-dom";

const AttendanceChart = ({ attendance }) => {
    const navigate = useNavigate();

    if (!attendance || attendance.totalClasses === 0) {
        return (
            <div className="chart-card" onClick={() => navigate("/attendance")} style={{ cursor: "pointer" }}>
                <div className="chart-header">
                    <div>
                        <h3>Attendance</h3>
                        <p>Overall attendance</p>
                    </div>
                    <span className="chart-status">-</span>
                </div>
                <div className="attendance-chart">
                    <p style={{ textAlign: "center", paddingTop: "80px" }}>No attendance data</p>
                </div>
            </div>
        );
    }

    const absentClasses = attendance.totalClasses - attendance.presentClasses;
    const attendancePercentage = attendance.percentage || 0;

    const attendanceData = [
        {
            name: "Present",
            value: attendance.presentClasses
        },
        {
            name: "Absent",
            value: absentClasses
        }
    ];

    const status = attendancePercentage >= 75 ? "Good" : attendancePercentage >= 60 ? "Average" : "Poor";

    return (
        <div className="chart-card" onClick={() => navigate("/attendance")} style={{ cursor: "pointer" }}>

            <div className="chart-header">

                <div>
                    <h3>Attendance</h3>

                    <p>
                        Overall attendance
                    </p>
                </div>

                <span className="chart-status">
                    {status}
                </span>

            </div>

            <div className="attendance-chart">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <PieChart>

                        <Pie
                            data={attendanceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={2}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                        >

                            <Cell fill="#4f46e5" />
                            <Cell fill="#e8eaf0" />

                        </Pie>

                        <Tooltip
                            formatter={(value) => [
                                `${value}`,
                                "Classes"
                            ]}
                        />

                        <text
                            x="50%"
                            y="48%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="attendance-percentage"
                        >
                            {attendancePercentage}%
                        </text>

                        <text
                            x="50%"
                            y="59%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="attendance-label"
                        >
                            Attendance
                        </text>

                    </PieChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
};

export default AttendanceChart;