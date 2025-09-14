const router = require('express').Router();
const v = require('./auth.validation');
const c = require('./auth.controller');
const { requireAuth } = require('./auth.middleware');

// สมัคร + ล็อกอิน
router.post('/register', v.register, c.register);
router.post('/login', v.login, c.login);

// ดูโปรไฟล์ตัวเอง (ตัวอย่าง endpoint ที่ต้อง login)
router.get('/me', requireAuth, c.me);

module.exports = router;
