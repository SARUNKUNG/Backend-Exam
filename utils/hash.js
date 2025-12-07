// utils/hash.js

const bcrypt = require('bcrypt');
const saltRounds = 10; // กำหนดความซับซ้อนของการ Hash

/** Hash รหัสผ่านที่เป็น plain text */
async function hashPassword(password) {
    return bcrypt.hash(password, saltRounds);
}

/** เปรียบเทียบรหัสผ่าน plain text กับรหัสผ่านที่ถูก Hash แล้ว */
async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

module.exports = { hashPassword, comparePassword };