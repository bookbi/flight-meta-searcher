const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");
const User = require("../models/User");

function toSafeUser(user) {
  if (!user) return null;
  const plain = user.get ? user.get({ plain: true }) : user;
  const { password, ...safe } = plain;
  return safe;
}

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function verifyPassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}

function generateToken(userId, options = { expiresIn: "1h" }) {
  return jwt.sign({ sub: userId }, JWT_SECRET, options);
}

async function findByEmail(email) {
  return User.findOne({ where: { email } });
}

async function createUser({ fullName, email, password }) {
  const exist = await findByEmail(email);
  if (exist) {
    const err = new Error("EMAIL_EXISTS");
    err.code = "EMAIL_EXISTS";
    throw err;
  }
  const hashed = await hashPassword(password);
  const user = await User.create({ fullName, email, password: hashed });
  return toSafeUser(user);
}

async function getAllUsers() {
  const users = await User.findAll({ order: [["id", "ASC"]] });
  return users.map(toSafeUser);
}

async function getUserById(id) {
  const user = await User.findByPk(id);
  return toSafeUser(user);
}

async function updateUser(id, { fullName, email, password } = {}) {
  const user = await User.findByPk(id);
  if (!user) return null;

  if (typeof fullName !== "undefined") user.fullName = fullName;
  if (typeof email !== "undefined") user.email = email;
  if (typeof password !== "undefined" && password !== "") {
    user.password = await hashPassword(password);
  }
  await user.save();
  return toSafeUser(user);
}

async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) return false;
  await user.destroy();
  return true;
}

module.exports = {
  // transforms
  toSafeUser,
  // crypto
  hashPassword,
  verifyPassword,
  generateToken,
  // user ops
  findByEmail,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

