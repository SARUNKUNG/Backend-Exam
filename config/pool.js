// config/pool.js
const mysql = require('mysql2/promise');
require('dotenv').config(); // โหลดตัวแปรสภาพแวดล้อมจากไฟล์ .env

// สร้าง Connection Pool เพื่อการเชื่อมต่อฐานข้อมูลที่มีประสิทธิภาพ
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // จำกัดจำนวนการเชื่อมต่อพร้อมกัน
    queueLimit: 0
});

console.log(`Database pool initialized for ${process.env.DB_NAME}`);

module.exports = pool;