import express from 'express';
const router = express.Router();

import {
  crearUsuario,     
  getUsuarios,
  eliminarUsuario,    
  actualizarUsuario,
  asignarRol,
  obtenerEstadisticas,
  obtenerPorRol,
  desactivarUsuario,
  activarUsuario
} from "../controllers/usuarioController.js";

import verifyToken from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/roleMiddleware.js";
import { requirePermission, requireSuperAdmin } from "../middleware/permissionMiddleware.js";

// Rutas básicas (Solo Superadmin)
router.post("/", verifyToken, authorizeRole("superadmin"), crearUsuario);
router.get("/", verifyToken, authorizeRole("superadmin", "admin"), getUsuarios);
router.delete("/:id", verifyToken, authorizeRole("superadmin"), eliminarUsuario);
router.put("/:id", verifyToken, authorizeRole("superadmin"), actualizarUsuario);

/**
 * RUTAS SOLO PARA SUPERADMIN
 */

// Asignar rol a un usuario
router.post(
  "/asignar-rol",
  verifyToken,
  requirePermission('usuarios:asignar-rol'),
  asignarRol
);

// Obtener estadísticas de usuarios
router.get(
  "/estadisticas/general",
  verifyToken,
  requirePermission('usuarios:listar'),
  obtenerEstadisticas
);

// Obtener usuarios por rol
router.get(
  "/role/:role",
  verifyToken,
  requireSuperAdmin,
  obtenerPorRol
);

// Desactivar usuario
router.patch(
  "/:id/desactivar",
  verifyToken,
  requireSuperAdmin,
  desactivarUsuario
);

// Activar usuario
router.patch(
  "/:id/activar",
  verifyToken,
  requireSuperAdmin,
  activarUsuario
);

export default router;