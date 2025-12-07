// repositories/subjectRepository.js

const pool = require("../config/pool");

// ตัวช่วยในการแปลงชื่อคอลัมน์จาก DB เป็น property ของ JavaScript object
const mapToSubject = (row) => ({
    id: row.id,
    code: row.subject_code,
    title: row.subject_title,
    credit: row.credit
});

/** ค้นหาวิชาทั้งหมด */
async function findAll() {
    const [rows] = await pool.query(
        "SELECT id, subject_code, subject_title, credit FROM subjects"
    );
    return rows.map(mapToSubject);
}

/** ค้นหาวิชาด้วย ID */
async function findById(id) {
    const [rows] = await pool.query(
        "SELECT id, subject_code, subject_title, credit FROM subjects WHERE id = ?",
        [id]
    );
    return rows.length > 0 ? mapToSubject(rows[0]) : null;
}

/** บันทึกวิชาใหม่ */
async function save(subject) {
    const [result] = await pool.query(
        "INSERT INTO subjects (subject_code, subject_title, credit) VALUES (?, ?, ?)",
        [subject.code, subject.title, subject.credit]
    );
    if (result.affectedRows === 0) return null;
    return findById(result.insertId);
}

/** อัปเดตวิชาที่มีอยู่ */
async function update(id, subject) {
    const [result] = await pool.query(
        "UPDATE subjects SET subject_code = ?, subject_title = ?, credit = ? WHERE id = ? LIMIT 1",
        [subject.code, subject.title, subject.credit, id]
    );
    if (result.affectedRows === 0) return null;
    return findById(id);
}

/** ลบวิชาด้วย ID */
async function remove(id) {
    const [result] = await pool.query(
        "DELETE FROM subjects WHERE id = ? LIMIT 1",
        [id]
    );
    // คืนค่า true ถ้ามีการลบเกิดขึ้น
    return result.affectedRows > 0;
}

module.exports = { findAll, findById, save, update, remove };