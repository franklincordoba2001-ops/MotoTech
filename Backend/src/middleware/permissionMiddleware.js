import { hasPermission } from '../utils/permissions.js';

/**
 * Middleware para validar permisos específicos
 * @param {string} permission - Permisos requeridos (ej: 'usuarios:crear')
 * @returns {function} Middleware function
 */
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'No autorizado - Token inválido',
        code: 'NO_TOKEN'
      });
    }

    const userRole = req.user.role || '';
    
    if (!hasPermission(userRole, permission)) {
      return res.status(403).json({ 
        message: `No tienes permiso para: ${permission}`,
        code: 'FORBIDDEN',
        requiredPermission: permission,
        userRole: userRole
      });
    }

    next();
  };
};

/**
 * Middleware para validar múltiples permisos (cualquiera de ellos)
 * @param {...string} permissions - Permisos opcionales
 * @returns {function} Middleware function
 */
export const requireAnyPermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'No autorizado - Token inválido',
        code: 'NO_TOKEN'
      });
    }

    const userRole = req.user.role || '';
    const hasAny = permissions.some(perm => hasPermission(userRole, perm));

    if (!hasAny) {
      return res.status(403).json({ 
        message: `No tienes permiso. Requeridos: ${permissions.join(' o ')}`,
        code: 'FORBIDDEN',
        requiredPermissions: permissions,
        userRole: userRole
      });
    }

    next();
  };
};

/**
 * Middleware para validar que sea superadmin
 * @returns {function} Middleware function
 */
export const requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'No autorizado',
      code: 'NO_TOKEN'
    });
  }

  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ 
      message: 'Solo superadmin puede acceder',
      code: 'FORBIDDEN_SUPERADMIN_ONLY',
      userRole: req.user.role
    });
  }

  next();
};

export default requirePermission;
