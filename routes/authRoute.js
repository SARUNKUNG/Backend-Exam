// routes/authRoute.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const { validate } = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../validators/authSchema');

// POST /auth/register - ใช้ Middleware validate ก่อนเข้า Controller
router.post('/register', validate(registerSchema, 'body'), controller.register);
// POST /auth/login - ใช้ Middleware validate ก่อนเข้า Controller
router.post('/login', validate(loginSchema, 'body'), controller.login);

module.exports = router;