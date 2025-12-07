// middlewares/validate.js

const { createError } = require("../config/errorHandler");

/**
 * ฟังก์ชัน Middleware สำหรับตรวจสอบข้อมูล Request โดยใช้ Joi Schema
 * @param {Joi.Schema} schema - Joi schema ที่ใช้ตรวจสอบ
 * @param {string} property - ส่วนของ Request ที่จะตรวจสอบ ('body', 'query', หรือ 'params')
 */
function validate(schema, property) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false, // แสดง error ทั้งหมด ไม่หยุดเมื่อเจออันแรก
            allowUnknown: true // อนุญาตให้มี field อื่น ๆ ที่ไม่ได้กำหนดใน schema ได้
        });

        if (error) {
            // แปลง Joi error ให้เป็นข้อความที่อ่านง่าย
            const details = error.details.map(d => d.message.replace(/\"/g, ''));
            const message = `Validation failed: ${details.join('; ')}`;

            // โยน 400 Bad Request error
            const err = createError(message, 400, 'INPUT_VALIDATION_FAILED');
            return next(err); // ส่ง error ไปยัง Global Error Handler
        }

        // แทนที่ req[property] ด้วยข้อมูลที่ถูก Sanitized/Validated แล้ว
        req[property] = value;
        next();
    };
}

module.exports = { validate };