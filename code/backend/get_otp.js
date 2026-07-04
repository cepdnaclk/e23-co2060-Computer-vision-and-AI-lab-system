require('dotenv').config();
const pool = require('./config/db');

async function get() {
    const res = await pool.query("SELECT otp FROM otp_verifications WHERE email = 'test@eng.pdn.ac.lk'");
    console.log("OTP is:", res.rows[0]?.otp);
    pool.end();
}
get();
