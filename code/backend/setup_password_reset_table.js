require('dotenv').config();
const pool = require('./config/db');

const setup = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS password_reset_otp (
                email VARCHAR(200) PRIMARY KEY,
                otp VARCHAR(6) NOT NULL,
                expires_at TIMESTAMP NOT NULL
            );
        `);
        console.log("password_reset_otp table created successfully.");
    } catch (error) {
        console.error("Error creating table:", error.message);
    } finally {
        pool.end();
    }
};

setup();
