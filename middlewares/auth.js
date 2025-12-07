// middlewares/auth.js

const { verifyToken } = require('../utils/jwt');
const { createError } = require('../config/errorHandler');

// 1. Authentication Middleware (ตรวจสอบ JWT Token)
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // ตรวจสอบว่ามี Header และขึ้นต้นด้วย 'Bearer ' หรือไม่
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(createError('Authentication token is required.', 401, 'UNAUTHORIZED'));
    }

    const token = authHeader.split(' ')[1];
    const user = verifyToken(token); // ตรวจสอบ Token

    if (!user) {
        // Token ไม่ถูกต้อง หรือหมดอายุ
        return next(createError('Invalid or expired token.', 403, 'FORBIDDEN'));
    }

    // แนบข้อมูลผู้ใช้ (id, role, etc.) จาก Token เข้าไปใน req object
    req.user = user;
    next();
};

// 2. Authorization Middleware (ตรวจสอบ Role-Based Access Control - RBAC)
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user ต้องมีข้อมูลจากการทำงานของ 'authenticate' ก่อนหน้านี้
        if (!req.user || !req.user.role) {
            return next(createError('User role not found after authentication.', 403, 'FORBIDDEN_ROLE_CHECK'));
        }

        const hasPermission = allowedRoles.includes(req.user.role);

        if (!hasPermission) {
            // ปฏิเสธการเข้าถึง
            return next(createError('Access denied. Insufficient permissions.', 403, 'ACCESS_DENIED'));
        }
        next();
    };
};

module.exports = { authenticate, authorize };