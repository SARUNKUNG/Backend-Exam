// validators/subjectSchema.js

const Joi = require('joi');

// Schema สำหรับการสร้าง/อัปเดตข้อมูล Subject
const subjectSchema = Joi.object({
    code: Joi.string().required().max(10).messages({
        'any.required': 'Subject code is required.',
        'string.max': 'Subject code must be no longer than 10 characters.'
    }),
    title: Joi.string().required(),
    credit: Joi.number().required().min(1).max(3)
});

module.exports = {
    subjectSchema
};