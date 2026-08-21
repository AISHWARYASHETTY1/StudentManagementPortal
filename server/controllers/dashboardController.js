const { sql } = require("../config/db");

const getDashboardData = async (req, res) => {
    try {
        debugger
        const studentId = Number(req.params.studentId);

        if (!Number.isInteger(studentId) || studentId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        // 1. Attendance summary with parameterized query
        const attendanceRequest = new sql.Request();
        attendanceRequest.input("StudentId", sql.Int, studentId);

        console.log("1. StudentId:", studentId);
        
        const attendanceSummary = await attendanceRequest.query(`
            EXEC dbo.getAttendanceSummary @StudentId = @StudentId;
        `);

        console.log("2. Attendance:", attendanceSummary.recordset);
        // 2. Attendance percentage
        const totalClasses =
            attendanceSummary.recordset[0].TotalClasses || 0;

        const presentClasses =
            attendanceSummary.recordset[0].PresentClasses || 0;

        const attendancePercentage =
            totalClasses > 0
                ? Number(
                    (
                        (presentClasses / totalClasses) * 100
                    ).toFixed(1)
                )
                : 0;


        // 3. Student courses with parameterized query
        const coursesRequest = new sql.Request();
        coursesRequest.input("StudentId", sql.Int, studentId);
        
        const coursesResult = await coursesRequest.query(`
           EXEC dbo.GetStudentCoursesByStudentId @StudentId = @StudentId;
        `);

        console.log("3. Courses:", coursesResult.recordset);


        // 4. Total credits with parameterized query
        const creditsRequest = new sql.Request();
        creditsRequest.input("StudentId", sql.Int, studentId);
        
        const creditsResult = await creditsRequest.query(`
            EXEC dbo.GetStudentTotalCredits @StudentId = @StudentId;
        `);

        console.log("4. Credits:", creditsResult.recordset);


        // 5. Marks with course information with parameterized query
        const marksRequest = new sql.Request();
        marksRequest.input("StudentId", sql.Int, studentId);
        
        const marksResult = await marksRequest.query(`
            EXEC dbo.[GetStudentMarks] @StudentId = @StudentId;
        `);
        console.log("5. Marks:", marksResult.recordset);


        // 6. Calculate average percentage with parameterized query
        const summaryRequest = new sql.Request();
        summaryRequest.input("StudentId", sql.Int, studentId);
        
        const marksSummary = await summaryRequest.query(`
            EXEC dbo.GetStudentTotalMarks @StudentId = @StudentId;
        `);
        console.log("6. Marks Summary:", marksSummary.recordset);

        const totalMarksObtained =
            Number(
                marksSummary.recordset[0]
                    .TotalMarksObtained
            );

        const totalMaxMarks =
            Number(
                marksSummary.recordset[0]
                    .TotalMaxMarks
            );

        const academicPercentage =
            totalMaxMarks > 0
                ? Number(
                    (
                        (totalMarksObtained /
                            totalMaxMarks) *
                        100
                    ).toFixed(1)
                )
                : 0;


        // Final dashboard response
        res.status(200).json({
            studentId: Number(studentId),

            summary: {
                attendance: attendancePercentage,

                academicPerformance:
                    academicPercentage,

                totalCredits:
                    Number(
                        creditsResult.recordset[0]
                            .TotalCredits
                    ),

                totalCourses:
                    coursesResult.recordset.length
            },

            attendance: {
                totalClasses: Number(totalClasses),
                presentClasses: Number(presentClasses),
                percentage: attendancePercentage
            },

            courses: coursesResult.recordset,

            marks: marksResult.recordset
        });

    } catch (error) {

        console.error(
            "Dashboard data error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch dashboard data"
        });
    }
};

module.exports = {
    getDashboardData
};