// validators/authSchema.js

const Joi = require('joi');

// Schema สำหรับการลงทะเบียน
const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({'string.email': 'Email format is invalid.'}),
    password: Joi.string().min(6).required().messages({'string.min': 'Password must be at least 6 characters.'}),
    name: Joi.string().required(),
    // อนุญาตให้กำหนด Role ได้ แต่กำหนด default เป็น 'USER'
    role: Joi.string().valid('ADMIN', 'MANAGER', 'USER').default('USER').optional()
});

// Schema สำหรับการ Login
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = {
    registerSchema,
    loginSchema
};