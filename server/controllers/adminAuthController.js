const { sql } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        // Query admin from database
        const request = new sql.Request();
        request.input("Username", sql.VarChar, username);

        const result = await request.query(`
            EXEC dbo.[getAdminByUsername] @Username = @Username;
        `);

        const admin = result.recordset[0];

        // Check if admin exists
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        // Check if admin is active
        if (!admin.IsActive) {
            return res.status(403).json({
                success: false,
                message: "This admin account is inactive"
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, admin.PasswordHash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: admin.AdminId,
                adminId: admin.AdminId,
                username: admin.Username,
                name: admin.Name,
                role: "admin"
            },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Update last login
        const updateRequest = new sql.Request();
        updateRequest.input("AdminId", sql.Int, admin.AdminId);
        updateRequest.input("LastLogin", sql.DateTime, new Date());

        await updateRequest.query(`
            EXEC dbo.RecordAdminLogin
                @AdminId = @AdminId,
                @LastLogin = @LastLogin;
        `);

        // Send response
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            admin: {
                AdminId: admin.AdminId,
                Username: admin.Username,
                Name: admin.Name,
                Email: admin.Email,
                Role: "admin"
            }
        });

    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
};

const adminLogout = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        console.error("Admin logout error:", error);
        res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
};

const getAdminProfile = async (req, res) => {
    try {
        const adminId = req.user?.adminId;

        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const request = new sql.Request();
        request.input("AdminId", sql.Int, adminId);

        const result = await request.query(`
            EXEC dbo.[GetAdminById] @AdminId = @AdminId;
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.status(200).json({
            success: true,
            admin: result.recordset[0]
        });

    } catch (error) {
        console.error("Get admin profile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch admin profile"
        });
    }
};

module.exports = {
    adminLogin,
    adminLogout,
    getAdminProfile
};
