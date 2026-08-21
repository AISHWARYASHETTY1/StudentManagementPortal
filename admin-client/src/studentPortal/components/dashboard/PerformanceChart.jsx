import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";


const PerformanceChart = ({ marks }) => {

    const performanceData = marks.map(
        (mark) => ({

            course:
                mark.CourseCode ||
                mark.CourseName,

            percentage:
                mark.MaxMarks > 0
                    ? Number(
                        (
                            (mark.MarksObtained /
                                mark.MaxMarks) *
                            100
                        ).toFixed(1)
                    )
                    : 0

        })
    );


    return (

        <div className="chart-card">

            <div className="chart-header">

                <div>

                    <h3>
                        Academic Performance
                    </h3>

                    <p>
                        Performance across courses
                    </p>

                </div>

            </div>


            <div className="performance-chart">

                {performanceData.length > 0 ? (

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >

                        <BarChart
                            data={performanceData}
                            margin={{
                                top: 10,
                                right: 10,
                                left: -15,
                                bottom: 0
                            }}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                            />


                            <XAxis
                                dataKey="course"
                                axisLine={false}
                                tickLine={false}
                                fontSize={10}
                            />


                            <YAxis
                                domain={[0, 100]}
                                axisLine={false}
                                tickLine={false}
                                fontSize={10}
                                tickFormatter={(value) =>
                                    `${value}%`
                                }
                            />


                            <Tooltip
                                formatter={(value) => [
                                    `${value}%`,
                                    "Score"
                                ]}
                            />


                            <Bar
                                dataKey="percentage"
                                fill="#4f46e5"
                                radius={[5, 5, 0, 0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                ) : (

                    <div className="chart-placeholder">

                        No marks available

                    </div>

                )}

            </div>

        </div>

    );

};


export default PerformanceChart;