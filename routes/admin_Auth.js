const express = require("express");
const { authGuard } = require("../middlewares/authMiddleware");
const {
  listUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/admin_AuthController");

const router = express.Router();

router.get("/users", authGuard, listUsers);
router.get("/users/:id", authGuard, getUser);
router.put("/users/:id", authGuard, updateUser);
router.delete("/users/:id", authGuard, deleteUser);

module.exports = router;
