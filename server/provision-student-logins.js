// Development helper: create login rows for active students that do not yet
// have one. Production should replace the shared password with invitations
// and a forced first-login password change.
const bcrypt = require("bcrypt");
const { sql, connectDB } = require("./config/db");

const DEVELOPMENT_PASSWORD = process.env.DEV_STUDENT_PASSWORD || "Student@123";

async function provisionStudentLogins() {
    await connectDB();
    const passwordHash = await bcrypt.hash(DEVELOPMENT_PASSWORD, 12);
    const students = await sql.query(`
        SELECT s.StudentId, s.StudentCode
        FROM Students s
        LEFT JOIN StudentUsers su ON su.StudentId = s.StudentId
        WHERE s.IsActive = 1 AND su.StudentUserId IS NULL
        ORDER BY s.StudentCode
    `);

    for (const student of students.recordset) {
        const request = new sql.Request();
        request.input("StudentId", sql.Int, student.StudentId);
        request.input("PasswordHash", sql.VarChar(255), passwordHash);
        request.input("IsActive", sql.Bit, 1);
        await request.query(`
            INSERT INTO StudentUsers (StudentId, PasswordHash, IsActive, CreatedAt)
            VALUES (@StudentId, @PasswordHash, @IsActive, GETDATE())
        `);
        console.log(`${student.StudentCode}: login provisioned`);
    }

    console.log(`Provisioned ${students.recordset.length} student login(s).`);
    console.log(`Development password: ${DEVELOPMENT_PASSWORD}`);
    process.exit(0);
}

provisionStudentLogins().catch(error => {
    console.error("Student login provisioning failed:", error.message);
    process.exit(1);
});
