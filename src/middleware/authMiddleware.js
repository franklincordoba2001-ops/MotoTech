import jwt from 'jsonwebtoken';

const SECRET_KEY = "secreto_super_seguro";


const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};




export const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    return res.status(403).json({ 
      message: "Acceso denegado: Se requieren permisos de Dueño del Software (SuperAdmin)." 
    });
  }
};


export const isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    next();
  } else {
    return res.status(403).json({ 
      message: "Acceso denegado: Solo para administradores autorizados." 
    });
  }
};


export default verifyToken;