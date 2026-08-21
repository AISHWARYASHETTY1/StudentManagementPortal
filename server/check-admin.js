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

const checkAdmin = async () => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query("SELECT AdminId, Username, Name, Email, IsActive FROM Admins");
        
        console.log("📋 Admin users in database:");
        console.log(result.recordset);
        
        await pool.close();
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

checkAdmin();
