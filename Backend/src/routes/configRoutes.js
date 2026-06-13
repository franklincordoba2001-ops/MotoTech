import express from 'express';
import * as configController from '../controllers/configController.js';
import verifyToken from '../middleware/authMiddleware.js';
import { requirePermission, requireSuperAdmin } from '../middleware/permissionMiddleware.js';

const router = express.Router();

/**
 * RUTAS PÚBLICAS (sin autenticación)
 */
router.get('/ubicacion', configController.getUbicacionTaller);

/**
 * RUTAS PROTEGIDAS - Solo para SUPERADMIN
 */

// Obtener toda la configuración
router.get(
  '/',
  verifyToken,
  requirePermission('config:ver'),
  configController.obtenerConfiguracion
);

// Obtener configuración específica
router.get(
  '/:clave',
  verifyToken,
  requirePermission('config:ver'),
  configController.obtenerConfiguracionPorClave
);

// Actualizar configuración
router.put(
  '/',
  verifyToken,
  requirePermission('config:actualizar'),
  configController.actualizarConfiguracion
);

/**
 * RUTAS DE MARCAS DE MOTO
 */

// Obtener marcas
router.get(
  '/marcas/listado',
  verifyToken,
  requirePermission('config:marcas'),
  configController.obtenerMarcas
);

// Actualizar marcas
router.put(
  '/marcas/actualizar',
  verifyToken,
  requirePermission('config:marcas'),
  configController.actualizarMarcas
);

/**
 * RUTAS DE PRECIOS DE MANO DE OBRA
 */

// Obtener precios
router.get(
  '/precios/mano-de-obra',
  verifyToken,
  requirePermission('config:precios'),
  configController.obtenerPreciosManodeObra
);

// Actualizar precios
router.put(
  '/precios/mano-de-obra',
  verifyToken,
  requirePermission('config:precios'),
  configController.actualizarPreciosManodeObra
);

// Eliminar configuración
router.delete(
  '/:clave',
  verifyToken,
  requireSuperAdmin,
  configController.eliminarConfiguracion
);

export default router;