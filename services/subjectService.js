// services/subjectService.js

const repository = require("../repositories/subjectRepository");
const { createError } = require("../config/errorHandler");

async function getAllSubjects() {
    return repository.findAll();
}

/** ดึงข้อมูลวิชาด้วย ID และจัดการกรณีไม่พบ (404) */
async function getSubjectById(id) {
    const subject = await repository.findById(id);
    if (!subject) {
        // Business Logic: โยน 404 Not Found error
        throw createError(`Subject with id ${id} not found.`, 404, 'NOT_FOUND');
    }
    return subject;
}

async function addSubject(newSubject) {
    const created = await repository.save(newSubject);
    if (!created) {
        throw createError("Failed to create subject.", 500, 'DB_SAVE_FAILED');
    }
    return created;
}

async function updateSubject(id, data) {
    // 1. ตรวจสอบว่า Subject มีอยู่จริงหรือไม่ก่อนอัปเดต (เพื่อจัดการ 404)
    const existingSubject = await repository.findById(id);
    if (!existingSubject) {
        throw createError(`Subject with id ${id} not found.`, 404, 'NOT_FOUND');
    }

    // 2. อัปเดตข้อมูล
    const updated = await repository.update(id, data);
    return updated;
}

async function removeSubject(id) {
    // 1. สั่งให้ Repository ลบ
    const isRemoved = await repository.remove(id);
    if (!isRemoved) {
        // ถ้าลบไม่สำเร็จ (เช่น id ไม่มีอยู่) ให้โยน 404
        throw createError(`Subject with id ${id} not found.`, 404, 'NOT_FOUND');
    }
    // สำหรับ 204 No Content ไม่ต้องคืนค่า
}

module.exports = { getAllSubjects, getSubjectById, addSubject, updateSubject, removeSubject };