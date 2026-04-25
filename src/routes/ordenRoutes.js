import express from 'express';
const router = express.Router();

import * as ordenController from '../controllers/ordenController.js';

import verifyToken from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';


router.get(
  "/",
  verifyToken,
  authorizeRole("admin", "superadmin", "usuario"),
  ordenController.getOrdenes
);


router.get(
  "/:id",
  verifyToken,
  authorizeRole("admin", "superadmin", "usuario"),
  ordenController.getOrden
);


router.post(
  "/",
  verifyToken,
  authorizeRole("admin", "superadmin"),
  ordenController.createOrden
);


router.put(
  "/:id",
  verifyToken,
  authorizeRole("admin", "superadmin"),
  ordenController.updateOrden
);


router.delete(
  "/:id",
  verifyToken,
  authorizeRole("admin", "superadmin"),
  ordenController.deleteOrden
);

export default router;