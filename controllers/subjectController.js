// controllers/subjectController.js

const service = require('../services/subjectService');
const { handleMySQLError } = require('../config/errorHandler');

module.exports = {
    // GET /subjects
    list: async (req, res, next) => {
        try {
            const subjects = await service.getAllSubjects();
            res.json(subjects);
        } catch (e) {
            next(e);
        }
    },

    // GET /subjects/:id
    get: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const subject = await service.getSubjectById(id); // Service จะตรวจสอบ 404
            res.json(subject);
        } catch (e) {
            next(e); // ส่ง Error 404 ไป Global Handler
        }
    },

    // POST /subjects
    create: async (req, res, next) => {
        try {
            // ข้อมูลถูก Validate โดย Middleware แล้ว
            const created = await service.addSubject(req.body);
            res.status(201).json(created);
        } catch (e) {
            // ดักจับ Error MySQL (เช่น รหัสวิชาซ้ำ) และแปลงเป็น 409
            const error = handleMySQLError(e);
            next(error);
        }
    },

    // PUT /subjects/:id
    update: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const updated = await service.updateSubject(id, req.body);
            res.json(updated);
        } catch (e) {
            // ดักจับ 404 จาก Service หรือ 409 จาก MySQL
            const error = handleMySQLError(e);
            next(error);
        }
    },

    // DELETE /subjects/:id
    remove: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            await service.removeSubject(id); // Service จะตรวจสอบ 404
            res.status(204).end(); // 204 No Content
        } catch (e) {
            next(e); // ส่ง Error 404 ไป Global Handler
        }
    }
};