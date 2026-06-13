import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./Login.css";

function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    direccion: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/auth/autoregistro", formData);
      
      if (response.status === 201) {
        toast.success("✅ ¡Cuenta creada con éxito! Ya puedes iniciar sesión.");
        navigate("/");
      }
    } catch (error) {
      toast.error("❌ Error: " + (error.response?.data?.error || "No se pudo crear la cuenta"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: "480px" }}>
        {/* Top Accent Bar */}
        <div className="login-top-bar"></div>

        {/* Brand Banner */}
        <div className="text-center mb-4">
          <div className="mb-2">
            <i className="bi bi-gear-wide-connected fs-1 brand-icon"></i>
          </div>
          <h2 className="brand-title mb-0">MOTOTECH</h2>
          <span className="brand-subtitle">Crea tu perfil de cliente</span>
        </div>

        <form onSubmit={handleRegister}>
          {/* Nombre */}
          <div className="custom-input-group">
            <label className="custom-label">Nombre Completo</label>
            <div className="custom-input-wrapper">
              <div className="input-icon-box">
                <i className="bi bi-person"></i>
              </div>
              <input
                type="text"
                name="nombre"
                className="custom-input"
                placeholder="Ej. Juan Pérez"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="custom-input-group">
            <label className="custom-label">Correo Electrónico</label>
            <div className="custom-input-wrapper">
              <div className="input-icon-box">
                <i className="bi bi-envelope"></i>
              </div>
              <input
                type="email"
                name="email"
                className="custom-input"
                placeholder="juan@correo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="custom-input-group">
            <label className="custom-label">Contraseña</label>
            <div className="custom-input-wrapper">
              <div className="input-icon-box">
                <i className="bi bi-lock"></i>
              </div>
              <input
                type="password"
                name="password"
                className="custom-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Teléfono y Dirección */}
          <div className="row g-2">
            <div className="col-md-6">
              <div className="custom-input-group">
                <label className="custom-label">Teléfono</label>
                <div className="custom-input-wrapper">
                  <div className="input-icon-box">
                    <i className="bi bi-telephone"></i>
                  </div>
                  <input
                    type="text"
                    name="telefono"
                    className="custom-input"
                    placeholder="310..."
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="custom-input-group">
                <label className="custom-label">Dirección</label>
                <div className="custom-input-wrapper">
                  <div className="input-icon-box">
                    <i className="bi bi-geo-alt"></i>
                  </div>
                  <input
                    type="text"
                    name="direccion"
                    className="custom-input"
                    placeholder="Barrio..."
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <button 
            className="btn btn-neon-orange w-100 py-3 d-flex align-items-center justify-content-center mb-4" 
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : (
              <i className="bi bi-person-plus me-2"></i>
            )}
            {loading ? "Creando cuenta..." : "Crear mi Cuenta"}
          </button>

          <div className="text-center register-link-box">
            <p className="small mb-0 text-muted">
              ¿Ya tienes una cuenta? <br />
              <Link to="/" className="neon-link fw-bold text-decoration-none d-inline-block mt-1">
                Inicia Sesión aquí
              </Link>
            </p>
          </div>
        </form>

        {/* Footer info */}
        <div className="text-center mt-4">
          <p className="footer-text mb-0">
            &copy; 2026 MotoTech Systems &bull; Quality Assured Suite v1.0
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;