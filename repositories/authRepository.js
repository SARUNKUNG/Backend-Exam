// repositories/authRepository.js

const pool = require("../config/pool");

/** ค้นหาผู้ใช้ด้วย email สำหรับการ Login */
async function findByEmail(email) {
    // ใช้ Prepared Statement เพื่อป้องกัน SQL Injection
    const [rows] = await pool.query(
        "SELECT id, email, password, role FROM users WHERE email = ?",
        [email]
    );
    // คืนค่า user object หรือ null ถ้าไม่พบ
    return rows.length > 0 ? rows[0] : null;
}

/** บันทึกผู้ใช้ใหม่ลงในฐานข้อมูล */
async function saveUser(user) {
    const [result] = await pool.query(
        "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
        [user.email, user.password, user.name, user.role]
    );
    if (result.affectedRows === 0) return null;

    // คืนค่าเฉพาะข้อมูลผู้ใช้ที่จำเป็น
    return { id: result.insertId, email: user.email, name: user.name, role: user.role };
}

module.exports = { findByEmail, saveUser };