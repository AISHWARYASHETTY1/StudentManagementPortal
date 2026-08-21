const sql = require("mssql");
require("dotenv").config();

const config = {
    server: "172.16.39.18",
    port: 1433,
    database: "StudentPortalDB",
    user: "sa",
    password: "Captiv@12345",
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const createMissingTables = async () => {
    try {
        const pool = await sql.connect(config);
        console.log("🔧 Checking and creating missing tables...\n");

        // Create Examinations table
        console.log("📋 Creating Examinations table...");
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Examinations')
            CREATE TABLE Examinations (
                ExamId INT PRIMARY KEY IDENTITY(1,1),
                CourseId INT NOT NULL,
                ExamName VARCHAR(255) NOT NULL,
                ExamDate DATE NOT NULL,
                ExamTime TIME NOT NULL,
                CreatedDate DATETIME DEFAULT GETDATE(),
                FOREIGN KEY (CourseId) REFERENCES Courses(CourseId)
            )
        `);
        console.log("✅ Examinations table ready\n");

        // Create Fees table
        console.log("📋 Creating Fees table...");
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Fees')
            CREATE TABLE Fees (
                FeeId INT PRIMARY KEY IDENTITY(1,1),
                StudentId INT NOT NULL,
                Amount DECIMAL(10,2) NOT NULL,
                DueDate DATE NOT NULL,
                Status VARCHAR(50) DEFAULT 'Pending',
                CreatedDate DATETIME DEFAULT GETDATE(),
                FOREIGN KEY (StudentId) REFERENCES Students(StudentId)
            )
        `);
        console.log("✅ Fees table ready\n");

        // Create Payments table
        console.log("📋 Creating Payments table...");
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Payments')
            CREATE TABLE Payments (
                PaymentId INT PRIMARY KEY IDENTITY(1,1),
                StudentId INT NOT NULL,
                Amount DECIMAL(10,2) NOT NULL,
                PaymentMethod VARCHAR(50) NOT NULL,
                PaymentDate DATETIME DEFAULT GETDATE(),
                FOREIGN KEY (StudentId) REFERENCES Students(StudentId)
            )
        `);
        console.log("✅ Payments table ready\n");

        // Create Timetable table
        console.log("📋 Creating Timetable table...");
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Timetable')
            CREATE TABLE Timetable (
                TimetableId INT PRIMARY KEY IDENTITY(1,1),
                CourseId INT NOT NULL,
                DayOfWeek VARCHAR(20) NOT NULL,
                StartTime TIME NOT NULL,
                EndTime TIME NOT NULL,
                Room VARCHAR(50),
                CreatedDate DATETIME DEFAULT GETDATE(),
                FOREIGN KEY (CourseId) REFERENCES Courses(CourseId)
            )
        `);
        console.log("✅ Timetable table ready\n");

        console.log("✅ All tables created successfully!");
        await pool.close();
        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

createMissingTables();
