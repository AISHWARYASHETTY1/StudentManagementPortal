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

const resetAdminPassword = async () => {
    try {
        const pool = await sql.connect(config);
        
        const newPassword = "Admin@123";
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        const request = new sql.Request(pool);
        request.input("Username", sql.VarChar, "admin");
        request.input("PasswordHash", sql.VarChar, hashedPassword);
        
        await request.query(`
            UPDATE Admins 
            SET PasswordHash = @PasswordHash 
            WHERE Username = @Username
        `);
        
        console.log("✅ Admin password reset successfully!");
        console.log("\n📝 New admin credentials:");
        console.log("   Username: admin");
        console.log("   Password: admin@123");
        
        await pool.close();
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

resetAdminPassword();
