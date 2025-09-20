const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// ▶ Register
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password)
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบ" });

    // เช็ค email ซ้ำ
    const exist = await User.findOne({ where: { email } });
    if (exist) return res.status(400).json({ error: "อีเมลนี้มีผู้ใช้แล้ว" });

    // hash password
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashed });

    res.status(201).json({ id: user.id, fullName: user.fullName, email: user.email });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาด" });
  }
});

// ▶ Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: "ไม่พบผู้ใช้นี้" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "รหัสผ่านไม่ถูกต้อง" });

    // สร้าง JWT token
    const token = jwt.sign({ sub: user.id }, "secretkey", { expiresIn: "1h" });
    res.json({ message: "เข้าสู่ระบบสำเร็จ", token });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาด" });
  }
});

module.exports = router;
