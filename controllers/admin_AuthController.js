const userService = require("../services/userService");

// GET /users
async function listUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

// GET /users/:id
async function getUser(req, res) {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

// PUT /users/:id
async function updateUser(req, res) {
  try {
    const { fullName, email, password } = req.body || {};
    const safe = await userService.updateUser(req.params.id, {
      fullName,
      email,
      password,
    });
    if (!safe) return res.status(404).json({ error: "User not found" });
    return res.json(safe);
  } catch (err) {
    return res.status(400).json({ error: "Update failed", detail: err?.message });
  }
}

// DELETE /users/:id
async function deleteUser(req, res) {
  try {
    const ok = await userService.deleteUser(req.params.id);
    if (!ok) return res.status(404).json({ error: "User not found" });
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = { listUsers, getUser, updateUser, deleteUser };
