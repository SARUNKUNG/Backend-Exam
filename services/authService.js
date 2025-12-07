// services/authService.js

const repository = require("../repositories/authRepository");
const { hashPassword, comparePassword } = require("../utils/hash");
const { createToken } = require("../utils/jwt");
const { createError } = require("../config/errorHandler");

/** ลงทะเบียนผู้ใช้ใหม่ */
async function registerUser(userData) {
    // 1. ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือไม่
    const existingUser = await repository.findByEmail(userData.email);
    if (existingUser) {
        throw createError('User with this email already exists.', 409, 'USER_ALREADY_EXISTS');
    }

    // 2. Hash รหัสผ่านก่อนบันทึก
    const hashedPassword = await hashPassword(userData.password);

    // 3. บันทึกผู้ใช้
    const newUser = { ...userData, password: hashedPassword };
    const createdUser = await repository.saveUser(newUser);

    if (!createdUser) {
        throw createError("Failed to save user.", 500, 'DB_SAVE_FAILED');
    }

    // คืนค่าข้อมูลผู้ใช้โดยไม่มีรหัสผ่าน
    const { password, ...userWithoutPass } = createdUser;
    return userWithoutPass;
}

/** จัดการการ Login */
async function login(email, password) {
    // 1. ค้นหาผู้ใช้
    const user = await repository.findByEmail(email);
    if (!user) {
        // ใช้ 401: Invalid Credentials
        throw createError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    // 2. เปรียบเทียบรหัสผ่าน
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw createError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    // 3. สร้าง Payload สำหรับ JWT (ต้องมี role สำหรับ RBAC)
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    // 4. ออก Token
    const token = createToken(payload);

    return { token, user: { id: user.id, email: user.email, role: user.role } };
}

module.exports = { registerUser, login };