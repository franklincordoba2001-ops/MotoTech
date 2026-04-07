const express = require("express");
const router = express.Router();
const ordenController = require("../controllers/ordenController");

const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

// VER
router.get(
  "/",
  verifyToken,
  authorizeRole("admin", "usuario"),
  ordenController.getOrdenes
);

router.get(
  "/:id",
  verifyToken,
  authorizeRole("admin", "usuario"),
  ordenController.getOrden
);

// CREAR
router.post(
  "/",
  verifyToken,
  authorizeRole("admin", "usuario"),
  ordenController.createOrden
);

// ACTUALIZAR
router.put(
  "/:id",
  verifyToken,
  authorizeRole("admin", "usuario"),
  ordenController.updateOrden
);

// ELIMINAR SOLO ADMIN
router.delete(
  "/:id",
  verifyToken,
  authorizeRole("admin"),
  ordenController.deleteOrden
);

module.exports = router;