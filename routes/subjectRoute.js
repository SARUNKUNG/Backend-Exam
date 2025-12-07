// routes/subjectRoute.js

const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const { validate } = require('../middlewares/validate');
const { subjectSchema } = require('../validators/subjectSchema');
const { authorize } = require('../middlewares/auth'); // Middleware สำหรับ RBAC

// GET /subjects และ GET /subjects/:id - ได้รับการป้องกันโดย 'authenticate' ใน app.js แล้ว
router.get('/', subjectController.list);
router.get('/:id', subjectController.get);

// POST /subjects - (1) ตรวจสอบ Role ADMIN, (2) ตรวจสอบ Joi Validation, (3) เข้า Controller
router.post('/',
    authorize('ADMIN'), // ต้องเป็น ADMIN เท่านั้น
    validate(subjectSchema, 'body'),
    subjectController.create
);

// PUT /subjects/:id - ต้องเป็น ADMIN หรือ MANAGER และมีการ Validate
router.put('/:id',
    authorize('ADMIN', 'MANAGER'),
    validate(subjectSchema, 'body'),
    subjectController.update
);

// DELETE /subjects/:id - ต้องเป็น ADMIN เท่านั้น
router.delete('/:id', authorize('ADMIN'), subjectController.remove);

module.exports = router;