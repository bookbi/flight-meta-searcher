const userService = require("../services/userService");

// POST /register
async function register(req, res) {
  try {
    const { fullName, email, password } = req.body || {};
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบ" });
    }

    const safe = await userService.createUser({ fullName, email, password });
    return res.status(201).json(safe);
  } catch (err) {
    if (err?.code === "EMAIL_EXISTS") {
      return res.status(400).json({ error: "อีเมลนี้มีผู้ใช้แล้ว" });
    }
    return res.status(500).json({ error: "เกิดข้อผิดพลาด" });
  }
}

// POST /login
async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบ" });

    const user = await userService.findByEmail(email);
    if (!user) return res.status(400).json({ error: "ไม่พบผู้ใช้นี้" });

    const match = await userService.verifyPassword(password, user.password);
    if (!match) return res.status(400).json({ error: "รหัสผ่านไม่ถูกต้อง" });

    const token = userService.generateToken(user.id);
    return res.json({ message: "เข้าสู่ระบบสำเร็จ", token });
  } catch (err) {
    return res.status(500).json({ error: "เกิดข้อผิดพลาด" });
  }
}

module.exports = { register, login };
