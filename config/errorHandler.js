// config/errorHandler.js

/**
 * สร้าง object Error แบบกำหนดเอง พร้อมแนบ HTTP status และ code
 * ทำให้ Service Layer สามารถโยน Error ที่ Controller นำไปตอบกลับได้ง่าย
 * @param {string} message - ข้อความ Error ที่มนุษย์อ่านได้
 * @param {number} status - รหัส HTTP status ที่เหมาะสม (เช่น 404, 400)
 * @param {string} code - รหัส Error แบบมาตรฐาน (เช่น 'NOT_FOUND', 'INPUT_VALIDATION_FAILED')
 */
function createError(message, status = 500, code = 'CUSTOM_ERROR') {
    const error = new Error(message);
    error.status = status;
    error.code = code;
    return error;
}

/**
 * จัดการกับรหัส Error เฉพาะจาก MySQL (เช่น ER_DUP_ENTRY)
 * @param {Error} e - object Error ดั้งเดิมจาก Repository layer
 * @returns {Error} object Error แบบมาตรฐานที่กำหนดเอง
 */
function handleMySQLError(e) {
    // ER_DUP_ENTRY (1062): รหัส Error ของ MySQL สำหรับการละเมิด Unique Constraint (เช่น รหัสวิชาซ้ำ)
    if (e.code === 'ER_DUP_ENTRY') {
        const message = 'Duplicate entry. The resource already exists.';
        // แปลงเป็น HTTP 409 Conflict
        return createError(message, 409, 'DUPLICATE_RESOURCE');
    }
    // ส่ง Error เดิมกลับไป หรือถ้าไม่มี status ให้ถือเป็น 500
    return createError(e.message || 'Internal Server Error', e.status || 500, e.code);
}

module.exports = {
    createError,
    handleMySQLError
};