const express = require("express");
const router = express.Router();
const flightDateController = require("../controllers/flightDateControllers");

// GET ทั้งหมด
router.get("/", flightDateController.getAll);

// GET ตาม ID
router.get("/:id", flightDateController.getById);

// POST เพิ่มใหม่
router.post("/", flightDateController.create);

// PUT อัปเดตตาม ID
router.put("/:id", flightDateController.update);

// DELETE ตาม ID
router.delete("/:id", flightDateController.delete);

module.exports = router;