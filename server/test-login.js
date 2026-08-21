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

const testLogin = async () => {
    try {
        const pool = await sql.connect(config);
        
        const username = "admin";
        const password = "admin@123";
        
        console.log("🔍 Testing login with:");
        console.log(`   Username: ${username}`);
        console.log(`   Password: ${password}\n`);
        
        // Query admin from database
        const request = new sql.Request(pool);
        request.input("Username", sql.VarChar, username);
        
        const result = await request.query(`
            SELECT AdminId, Username, PasswordHash, Name, Email, IsActive
            FROM Admins
            WHERE Username = @Username
        `);
        
        if (result.recordset.length === 0) {
            console.log("❌ Admin not found in database");
            await pool.close();
            process.exit(1);
        }
        
        const admin = result.recordset[0];
        console.log("✅ Admin found:");
        console.log(`   AdminId: ${admin.AdminId}`);
        console.log(`   Username: ${admin.Username}`);
        console.log(`   Name: ${admin.Name}`);
        console.log(`   Email: ${admin.Email}`);
        console.log(`   IsActive: ${admin.IsActive}`);
        console.log(`   PasswordHash: ${admin.PasswordHash}\n`);
        
        if (!admin.IsActive) {
            console.log("❌ Admin account is inactive");
            await pool.close();
            process.exit(1);
        }
        
        // Test password comparison
        console.log("🔐 Testing password...");
        const isPasswordValid = await bcrypt.compare(password, admin.PasswordHash);
        
        if (isPasswordValid) {
            console.log("✅ Password is CORRECT");
        } else {
            console.log("❌ Password is INCORRECT");
            console.log("\nℹ️  The password hash in the database doesn't match the provided password.");
            console.log("   Let's re-hash it to check:");
            
            const newHash = await bcrypt.hash(password, 10);
            console.log(`\n   Original hash: ${admin.PasswordHash}`);
            console.log(`   New hash:      ${newHash}`);
        }
        
        await pool.close();
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

testLogin();
