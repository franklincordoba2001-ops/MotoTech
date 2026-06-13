import { useState } from "react";
import { login } from "../services/api";
import { useNavigate, Link } from "react-router-dom"; 
import toast from "react-hot-toast";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      toast.error("⚠️ Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const data = await login({ email, password });
      
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("rol", data.user.role);
        localStorage.setItem("nombre", data.user.nombre);
        localStorage.setItem("usuario_id", data.user.id);
        
        toast.success("¡Bienvenido a MotoTech!");
        navigate("/dashboard");
      } else {
        toast.error("❌ Credenciales incorrectas");
      }
    } catch (error) {
      toast.error("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Top Accent Bar */}
        <div className="login-top-bar"></div>

        {/* Brand Banner */}
        <div className="text-center mb-5">
          <div className="mb-2">
            <i className="bi bi-gear-wide-connected fs-1 brand-icon"></i>
          </div>
          <h2 className="brand-title mb-0">MOTOTECH</h2>
          <span className="brand-subtitle">INDUSTRIAL WORKSHOP MANAGEMENT</span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {/* Email input group */}
          <div className="custom-input-group">
            <label className="custom-label">Correo Electrónico</label>
            <div className="custom-input-wrapper">
              <div className="input-icon-box">
                <i className="bi bi-envelope"></i>
              </div>
              <input
                type="email"
                className="custom-input"
                placeholder="admin@moto.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password input group */}
          <div className="custom-input-group">
            <label className="custom-label">Contraseña</label>
            <div className="custom-input-wrapper">
              <div className="input-icon-box">
                <i className="bi bi-lock"></i>
              </div>
              <input
                type="password"
                className="custom-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Action submit button */}
          <button 
            className="btn btn-neon-orange w-100 py-3 d-flex align-items-center justify-content-center mb-4" 
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : (
              <i className="bi bi-box-arrow-in-right me-2"></i>
            )}
            {loading ? "Iniciando..." : "Ingresar al Sistema"}
          </button>

          {/* Register area */}
          <div className="text-center register-link-box">
            <p className="small mb-0 text-muted">
              ¿Eres un cliente nuevo? <br />
              <Link to="/register" className="neon-link fw-bold text-decoration-none d-inline-block mt-1">
                Crea tu cuenta aquí
              </Link>
            </p>
          </div>
        </form>

        {/* Footer info */}
        <div className="text-center mt-5">
          <p className="footer-text mb-0">
            &copy; 2026 MotoTech Systems &bull; Quality Assured Suite v1.0
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;