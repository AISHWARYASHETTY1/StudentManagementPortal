const sql = require("mssql");

require("dotenv").config();


const config = {

    server: process.env.DB_SERVER || "172.16.39.18",

    port: Number(process.env.DB_PORT || 1433),

    database: process.env.DB_NAME || "StudentPortalDB",

    user: process.env.DB_USER || "sa",

    password: process.env.DB_PASSWORD || "Captiv@12345",

    options: {

        encrypt: false,

        trustServerCertificate: true

    }

};


let pool;


const connectDB = async () => {

    try {

        pool = await sql.connect(config);

        console.log(
            "✅ SQL Server connected successfully!"
        );

        return pool;

    } catch (error) {

        console.error(
            "❌ SQL Server connection failed:"
        );

        console.error(error.message);
        // Preserve the startup error for diagnostics. The HTTP server is
        // started by app.js even when SQL is temporarily unavailable.
        throw error;

    }

};


const getPool = () => {

    if (!pool) {

        throw new Error(
            "Database connection has not been established"
        );

    }

    return pool;

};


module.exports = {

    sql,

    connectDB,

    getPool

};
