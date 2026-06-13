import express from 'express';
const router = express.Router();

import * as repuestoController from '../controllers/repuestoController.js';
import verifyToken from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';

// Obtener catálogo completo de repuestos
router.get(
  "/",
  verifyToken,
  authorizeRole("superadmin", "admin", "mecanico", "cliente"),
  repuestoController.getRepuestos
);

// Obtener repuestos asignados a una orden
router.get(
  "/orden/:ordenId",
  verifyToken,
  authorizeRole("superadmin", "admin", "mecanico", "cliente"),
  repuestoController.getOrdenRepuestos
);

// Guardar/actualizar repuestos asignados a una orden
router.post(
  "/orden/:ordenId",
  verifyToken,
  authorizeRole("superadmin", "admin", "mecanico"),
  repuestoController.saveOrdenRepuestos
);

export default router;
