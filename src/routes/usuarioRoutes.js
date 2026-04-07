const express = require("express");
const router = express.Router();

const {
  createUsuario,
  getUsuarios,
  deleteUsuario,
} = require("../controllers/usuarioController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

// SOLO ADMIN
router.post("/", verifyToken, authorizeRole("admin"), createUsuario);

router.get("/", verifyToken, authorizeRole("admin"), getUsuarios);

router.delete("/:id", verifyToken, authorizeRole("admin"), deleteUsuario);

module.exports = router;