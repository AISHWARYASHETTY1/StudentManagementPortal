const { sql, connectDB } = require("./config/db");

const migrateAttendanceDateTime = async () => {
    try {
        await connectDB();
        await sql.query(`
            IF EXISTS (
                SELECT 1
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_NAME = 'Attendance'
                  AND COLUMN_NAME = 'AttendanceDate'
                  AND DATA_TYPE = 'date'
            )
            BEGIN
                ALTER TABLE Attendance ALTER COLUMN AttendanceDate DATETIME2 NOT NULL;
            END
        `);

        console.log("AttendanceDate now stores both class date and time.");
        process.exit(0);
    } catch (error) {
        console.error("Attendance date/time migration failed:", error.message);
        process.exit(1);
    }
};

migrateAttendanceDateTime();
