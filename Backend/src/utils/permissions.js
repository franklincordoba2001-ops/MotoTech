

export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  MECANICO: 'mecanico',
  CLIENTE: 'cliente',
};


export const PERMISSIONS = {
  
  'usuarios:crear': ['superadmin'],
  'usuarios:listar': ['superadmin', 'admin'],
  'usuarios:actualizar': ['superadmin'],
  'usuarios:eliminar': ['superadmin'],
  'usuarios:asignar-rol': ['superadmin'],

  
  'reportes:ver-financiero': ['superadmin'],
  'reportes:ver-ganancias': ['superadmin'],
  'reportes:descargar': ['superadmin', 'admin'],
  'reportes:general': ['superadmin', 'admin'],

  
  'config:ver': ['superadmin'],
  'config:actualizar': ['superadmin'],
  'config:precios': ['superadmin'],
  'config:marcas': ['superadmin'],

  
  'ordenes:crear': ['superadmin', 'admin'],
  'ordenes:listar': ['superadmin', 'admin', 'mecanico'],
  'ordenes:actualizar-estado': ['admin', 'mecanico'],
  'ordenes:eliminar': ['superadmin'],
  'ordenes:ver-propios': ['cliente'],

  
  'facturas:crear': ['admin'],
  'facturas:descargar': ['superadmin', 'admin', 'cliente'],
  'facturas:listar': ['superadmin', 'admin'],
  'facturas:eliminar': ['superadmin'],
  'facturas:ver-propios': ['cliente'],

  
  'clientes:crear': ['admin'],
  'clientes:listar': ['superadmin', 'admin'],
  'clientes:actualizar': ['admin'],
  'clientes:eliminar': ['superadmin'],
  'clientes:ver-propios': ['cliente'],

  
  'motos:crear': ['admin'],
  'motos:listar': ['superadmin', 'admin', 'mecanico'],
  'motos:actualizar': ['admin'],
  'motos:eliminar': ['superadmin'],
  'motos:ver-propios': ['cliente'],

  
  'inventario:ver': ['admin', 'mecanico'],
  'inventario:actualizar': ['admin'],
  'inventario:eliminar': ['superadmin'],

  
  'observaciones:crear': ['mecanico'],
  'observaciones:listar': ['mecanico', 'admin', 'superadmin'],
  'observaciones:actualizar': ['mecanico'],

  
  'roles:crear': ['superadmin'],
  'roles:listar': ['superadmin'],
  'roles:actualizar': ['superadmin'],
  'roles:eliminar': ['superadmin'],
};

/**
 * Verifica si un rol tiene permiso para una acción específica
 * @param {string} role - El rol del usuario
 * @param {string} permission - La acción a realizar (formato: 'recurso:accion')
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  const allowedRoles = PERMISSIONS[permission] || [];
  return allowedRoles.includes(role);
};

/**
 * Obtiene todos los permisos de un rol
 * @param {string} role - El rol
 * @returns {array} Lista de permisos
 */
export const getPermissionsByRole = (role) => {
  return Object.entries(PERMISSIONS)
    .filter(([_, roles]) => roles.includes(role))
    .map(([permission, _]) => permission);
};
