import express from 'express';
const router = express.Router();

import * as motoController from '../controllers/motoController.js';
import verifyToken from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';

router.get('/', verifyToken, authorizeRole('superadmin', 'admin', 'mecanico', 'cliente'), motoController.getMotos);
router.get('/:id', verifyToken, authorizeRole('superadmin', 'admin', 'mecanico', 'cliente'), motoController.getMoto);
router.post('/', verifyToken, authorizeRole('superadmin', 'admin', 'cliente'), motoController.createMoto);
router.put('/:id', verifyToken, authorizeRole('superadmin', 'admin'), motoController.updateMoto);
router.delete('/:id', verifyToken, authorizeRole('superadmin', 'admin'), motoController.deleteMoto);

export default router;