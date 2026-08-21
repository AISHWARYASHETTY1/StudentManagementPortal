const sql = require("mssql");
const bcrypt = require("bcrypt");
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

const setupAdmin = async () => {
    try {
        console.log("🔧 Starting admin setup...");
        
        // Connect to database
        const pool = await sql.connect(config);
        console.log("✅ Database connected");

        // Check if Admins table exists
        const tableCheck = await pool.request().query(`
            SELECT TABLE_NAME
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_NAME = 'Admins'
        `);

        if (tableCheck.recordset.length === 0) {
            console.log("📋 Creating Admins table...");
            
            await pool.request().query(`
                CREATE TABLE Admins (
                    AdminId INT PRIMARY KEY IDENTITY(1,1),
                    Username VARCHAR(100) UNIQUE NOT NULL,
                    PasswordHash VARCHAR(255) NOT NULL,
                    Name VARCHAR(255) NOT NULL,
                    Email VARCHAR(255) UNIQUE NOT NULL,
                    IsActive BIT DEFAULT 1,
                    CreatedDate DATETIME DEFAULT GETDATE(),
                    LastLogin DATETIME NULL
                )
            `);
            
            console.log("✅ Admins table created");
        } else {
            console.log("✅ Admins table already exists");
        }

        // Check if admin user exists
        const adminCheck = await pool.request().input("Username", sql.VarChar, "admin")
            .query("SELECT * FROM Admins WHERE Username = @Username");

        if (adminCheck.recordset.length > 0) {
            console.log("ℹ️  Admin user already exists");
            await pool.close();
            return;
        }

        // Hash password
        const plainPassword = "admin@123";
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // Insert default admin
        const request = new sql.Request(pool);
        request.input("Username", sql.VarChar, "admin");
        request.input("PasswordHash", sql.VarChar, hashedPassword);
        request.input("Name", sql.VarChar, "Administrator");
        request.input("Email", sql.VarChar, "admin@studentportal.com");

        await request.query(`
            INSERT INTO Admins (Username, PasswordHash, Name, Email, IsActive)
            VALUES (@Username, @PasswordHash, @Name, @Email, 1)
        `);

        console.log("✅ Admin user created successfully");
        console.log("📝 Default credentials:");
        console.log("   Username: admin");
        console.log("   Password: admin@123");
        console.log("\n⚠️  IMPORTANT: Change the password after first login!");

        await pool.close();
        process.exit(0);

    } catch (error) {
        console.error("❌ Setup failed:", error.message);
        process.exit(1);
    }
};

setupAdmin();
