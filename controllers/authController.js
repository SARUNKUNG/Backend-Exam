// controllers/authController.js

const authService = require('../services/authService');
const { handleMySQLError } = require('../config/errorHandler');

module.exports = {
    // POST /auth/register
    register: async (req, res, next) => {
        try {
            // เรียก Service เพื่อดำเนินการลงทะเบียน
            const result = await authService.registerUser(req.body);
            res.status(201).json(result); // 201 Created
        } catch (e) {
            // จัดการ Error 409 Conflict จากการลงทะเบียนซ้ำ (ER_DUP_ENTRY)
            const error = handleMySQLError(e);
            next(error); // ส่ง Error ไป Global Handler
        }
    },

    // POST /auth/login
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            // เรียก Service เพื่อดำเนินการ Login และรับ Token
            const result = await authService.login(email, password);
            res.json(result); // 200 OK พร้อม token
        } catch (e) {
            // Service โยน 401 สำหรับข้อมูลไม่ถูกต้อง
            next(e);
        }
    }
};