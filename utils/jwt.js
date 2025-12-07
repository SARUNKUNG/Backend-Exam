// utils/jwt.js

require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'fallback_secret'; // ใช้คีย์ลับจาก .env

/** สร้าง JWT token ใหม่ */
function createToken(payload) {
    // กำหนดให้ Token หมดอายุใน 1 วัน (1d)
    return jwt.sign(payload, secret, { expiresIn: '1d' });
}

/** ตรวจสอบความถูกต้องของ JWT token */
function verifyToken(token) {
    try {
        // ถ้า verify สำเร็จ จะ return payload
        return jwt.verify(token, secret);
    } catch (e) {
        // ถ้า verify ไม่สำเร็จ (เช่น หมดอายุ หรือไม่ถูกต้อง) จะ return null
        return null;
    }
}

module.exports = { createToken, verifyToken };