// routes/admin.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// ======= Simple JWT guard (ใช้ secret เดียวกับ auth.js) =======
function authGuard(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, "secretkey"); // ให้ตรงกับ auth.js
    req.userId = payload.sub;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ======= GET: รายการผู้ใช้ทั้งหมด (ซ่อน password) =======
router.get("/users", authGuard, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["id", "ASC"]],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ======= GET: ผู้ใช้ตาม id (ซ่อน password) =======
router.get("/users/:id", authGuard, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ======= PUT: อัปเดตผู้ใช้ =======
router.put("/users/:id", authGuard, async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (fullName !== undefined) user.fullName = fullName;
    if (email !== undefined) user.email = email;
    if (password !== undefined && password !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    const { password: _omit, ...safe } = user.get({ plain: true });
    res.json(safe);
  } catch (err) {
    // handle duplicate email ฯลฯ
    res.status(400).json({ error: "Update failed", detail: err?.message });
  }
});

// ======= DELETE: ลบผู้ใช้ =======
router.delete("/users/:id", authGuard, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.destroy();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
