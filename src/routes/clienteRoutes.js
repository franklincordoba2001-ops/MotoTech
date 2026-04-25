import express from 'express';
const router = express.Router();

import * as clienteController from '../controllers/clienteController.js';


import verifyToken, { isSuperAdmin, isAdmin } from '../Middleware/authMiddleware.js';


router.get('/', verifyToken, clienteController.getClientes);


router.get('/:id', verifyToken, clienteController.getCliente);


router.post('/', verifyToken, isAdmin, clienteController.createCliente);


router.put('/:id', verifyToken, isAdmin, clienteController.updateCliente);



router.delete('/:id', verifyToken, isAdmin, clienteController.deleteCliente);

export default router;