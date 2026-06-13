import express from 'express';
const router = express.Router();

import * as ordenController from '../controllers/ordenController.js';

import verifyToken from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';

router.get(
  "/",
  verifyToken,
  authorizeRole("superadmin", "admin", "mecanico", "cliente"),
  ordenController.getOrdenes
);

router.get(
  "/:id",
  verifyToken,
  authorizeRole("superadmin", "admin", "mecanico", "cliente"),
  ordenController.getOrden
);

router.post(
  "/",
  verifyToken,
  authorizeRole("superadmin", "admin", "cliente"),
  ordenController.createOrden
);

router.put(
  "/:id",
  verifyToken,
  authorizeRole("superadmin", "admin", "mecanico"),
  ordenController.updateOrden
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRole("superadmin", "admin"),
  ordenController.deleteOrden
);

export default router;