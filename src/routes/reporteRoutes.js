import express from 'express';
const router = express.Router();


import * as reporteController from '../controllers/reporteController.js';


import verifyToken from '../middleware/authMiddleware.js';


router.get('/total', verifyToken, reporteController.totalGeneral);

router.get('/metodo-pago', verifyToken, reporteController.totalPorMetodoPago);

router.get('/por-fecha', verifyToken, reporteController.totalPorFecha);


export default router;