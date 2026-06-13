import express from 'express';
const router = express.Router();

import * as clienteController from '../controllers/clienteController.js';

import verifyToken from '../middleware/authMiddleware.js';
import authorizeRole from '../middleware/roleMiddleware.js';


router.get('/', verifyToken, authorizeRole('superadmin', 'admin'), clienteController.getClientes);

router.get('/:id', verifyToken, authorizeRole('superadmin', 'admin'), clienteController.getCliente);

// Permitir solo a admin y superadmin crear clientes manualmente
router.post('/', verifyToken, authorizeRole('superadmin', 'admin'), clienteController.createCliente);

// Permitir a admin y superadmin actualizar clientes
router.put('/:id', verifyToken, authorizeRole('superadmin', 'admin'), clienteController.updateCliente);

// Eliminar para superadmin y admin
router.delete('/:id', verifyToken, authorizeRole('superadmin', 'admin'), clienteController.deleteCliente);

export default router;