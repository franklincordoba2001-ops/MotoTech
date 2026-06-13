const normalize = (r) => (r || '').toString().toLowerCase();

const authorizeRole = (...roles) => {
  const allowed = roles.map((r) => normalize(r));
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    // Normalizar rol del usuario
    let userRole = normalize(req.user.role);

    // Log breve para depuración (descomentar si se requiere auditar)
    // console.debug('[authorizeRole] user role:', req.user.role, '-> normalized:', userRole, 'allowed:', allowed);

    if (!allowed.includes(userRole)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    next();
  };
};

export default authorizeRole;