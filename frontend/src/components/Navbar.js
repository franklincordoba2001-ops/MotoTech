import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Bike, 
  ClipboardList, 
  Receipt, 
  BarChart3, 
  Settings, 
  LogOut, 
  User 
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const nombre = localStorage.getItem("nombre") || "Usuario";
  const role = localStorage.getItem("rol") || localStorage.getItem("role") || "";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  return (
    <nav className="custom-navbar">
      <div className="navbar-brand-container">
        <Link to="/dashboard" className="navbar-logo-link">
          <Bike className="navbar-logo-icon" size={24} />
          <span className="navbar-logo-text">MOTOTECH</span>
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/dashboard" className={isActive("/dashboard")}>
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </Link>
        
        {/* Administrador y Superadmin ven Clientes */}
        {(role === 'admin' || role === 'superadmin') && (
          <Link to="/clientes" className={isActive("/clientes")}>
            <Users size={16} />
            <span>Clientes</span>
          </Link>
        )}

        {/* Todos pueden ver Motos y Órdenes */}
        <Link to="/motos" className={isActive("/motos")}>
          <Bike size={16} />
          <span>Motos</span>
        </Link>
        
        <Link to="/ordenes" className={isActive("/ordenes")}>
          <ClipboardList size={16} />
          <span>Órdenes</span>
        </Link>

        {/* Mecánico no ve facturas */}
        {role !== 'mecanico' && (
          <Link to="/facturas" className={isActive("/facturas")}>
            <Receipt size={16} />
            <span>Facturas</span>
          </Link>
        )}

        {/* Solo Superadmin ve Usuarios, Roles, Reportes y Config */}
        {role === 'superadmin' && (
          <>
            <Link to="/usuarios" className={isActive("/usuarios")}>
              <Users size={16} />
              <span>Usuarios</span>
            </Link>
            <Link to="/roles" className={isActive("/roles")}>
              <Settings size={16} />
              <span>Roles</span>
            </Link>
            <Link to="/reportes" className={isActive("/reportes")}>
              <BarChart3 size={16} />
              <span>Reportes</span>
            </Link>
            <Link to="/config" className={isActive("/config")}>
              <Settings size={16} />
              <span>Config</span>
            </Link>
          </>
        )}
      </div>

      <div className="navbar-user-section">
        <div className="user-profile-badge">
          <User size={14} className="user-badge-icon" />
          <span className="user-badge-name">
            Hola, <strong className="user-name-strong">{nombre}</strong>
          </span>
          <span className="user-role-tag">{role}</span>
        </div>
        <button onClick={handleLogout} className="navbar-logout-btn" title="Cerrar Sesión">
          <LogOut size={16} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;