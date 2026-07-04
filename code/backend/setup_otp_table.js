require('dotenv').config();
const pool = require('./config/db');

const setup = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS otp_verifications (
                email VARCHAR(200) PRIMARY KEY,
                otp VARCHAR(6) NOT NULL,
                user_data JSONB NOT NULL,
                expires_at TIMESTAMP NOT NULL
            );
        `);
        console.log("otp_verifications table created successfully.");
    } catch (error) {
        console.error("Error creating table:", error.message);
    } finally {
        pool.end();
    }
};

setup();
