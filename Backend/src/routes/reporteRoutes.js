import express from 'express';
const router = express.Router();

import * as reporteController from '../controllers/reporteController.js';
import verifyToken from '../middleware/authMiddleware.js';
import { requirePermission, requireSuperAdmin } from '../middleware/permissionMiddleware.js';

// Rutas básicas (Admin)
router.get('/total', verifyToken, reporteController.totalGeneral);
router.get('/metodo-pago', verifyToken, reporteController.totalPorMetodoPago);
router.get('/por-fecha', verifyToken, reporteController.totalPorFecha);

/**
 * RUTAS SOLO PARA SUPERADMIN - Reportes Financieros
 */

// Obtener reporte financiero completo
router.get(
  '/financiero/completo',
  verifyToken,
  requirePermission('reportes:ver-financiero'),
  reporteController.obtenerReportFinanciero
);

// Obtener ganancias por mes
router.get(
  '/ganancias/mes',
  verifyToken,
  requirePermission('reportes:ver-ganancias'),
  reporteController.obtenerGananciasPorMes
);

// Obtener ganancias por día
router.get(
  '/ganancias/dia',
  verifyToken,
  requirePermission('reportes:ver-ganancias'),
  reporteController.obtenerGananciasPorDia
);

// Obtener estadísticas completas del taller
router.get(
  '/estadisticas/completas',
  verifyToken,
  requireSuperAdmin,
  reporteController.obtenerEstadisticasCompletas
);

export default router;
