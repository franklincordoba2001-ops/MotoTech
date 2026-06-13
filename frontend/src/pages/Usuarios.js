import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { getUsuarios, createUsuario, deleteUsuario, updateUsuario } from "../services/api"; 

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("usuario");
  
  // --- NUEVOS ESTADOS PARA EDITAR ---
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  const token = localStorage.getItem("token");

  const cargarUsuarios = useCallback(async () => {
    try {
      const response = await getUsuarios(token);
      // El backend devuelve { success: true, data: [...] }
      setUsuarios(response.data || response || []);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  }, [token]);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  // Función para preparar el formulario para editar
  const prepararEdicion = (u) => {
    setEditando(true);
    setIdEditar(u.id);
    setNombre(u.nombre);
    setEmail(u.email);
    setRole(u.role || "usuario");
    setPassword(""); // La contraseña se deja vacía por seguridad
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setIdEditar(null);
    setNombre("");
    setEmail("");
    setPassword("");
    setRole("usuario");
  };

  const handleSubmit = async () => {
    if (!nombre || !email) {
      toast.error("⚠️ Nombre y Email son obligatorios.");
      return;
    }

    try {
      if (editando) {
        // Lógica para ACTUALIZAR
        await updateUsuario(idEditar, { nombre, email, password, role }, token);
        toast.success("✅ Usuario actualizado");
      } else {
        // Lógica para CREAR (la que ya tenías)
        if (!password) {
          toast.error("⚠️ La contraseña es obligatoria para nuevos usuarios.");
          return;
        }
        await createUsuario({ nombre, email, password, role }, token);
        toast.success("✅ Usuario creado exitosamente");
      }
      
      cancelarEdicion();
      cargarUsuarios();
    } catch (error) {
      toast.error("❌ Error en la operación.");
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div>
        <p className="mb-3 text-light" style={{ fontSize: '13.5px', fontFamily: 'var(--font-sans)', lineHeight: '1.4', margin: 0 }}>
          ⚠️ <strong>¿Estás seguro de eliminar este usuario?</strong>
          <br />
          <span className="text-secondary" style={{ fontSize: '12px' }}>Esta acción es irreversible y removerá su acceso.</span>
        </p>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button 
            className="btn btn-sm btn-danger px-3 py-1.5 fw-bold"
            style={{ fontSize: '11px', borderRadius: '0px', textTransform: 'uppercase', letterSpacing: '0.5px' }}
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteUsuario(id, token);
                cargarUsuarios();
                toast.success("✅ Usuario eliminado con éxito");
              } catch (error) {
                toast.error("❌ No se pudo eliminar el usuario.");
              }
            }}
          >
            Confirmar
          </button>
          <button 
            className="btn btn-sm btn-secondary px-3 py-1.5 fw-bold"
            style={{ fontSize: '11px', borderRadius: '0px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}
            onClick={() => toast.dismiss(t.id)}
          >
            Cancelar
          </button>
        </div>
      </div>
    ), {
      duration: 8000,
      style: {
        background: '#12110f',
        border: '1px solid rgba(229, 193, 88, 0.35)',
        borderRadius: '0px',
        padding: '16px',
        minWidth: '320px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
      }
    });
  };

  return (
    <div className="min-vh-100">
      <Navbar />
      <div className="container py-5">
        <div className="row">
          <div className="col-12 d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-dark">
              <i className="bi bi-people-fill me-2 text-primary"></i>
              Control de Usuarios
            </h2>
            <span className="badge bg-primary rounded-pill px-3 py-2">
              Total: {usuarios.length}
            </span>
          </div>

          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-4">
                  {editando ? "Editar Usuario" : "Nuevo Registro"}
                </h5>
                
                <div className="mb-3">
                  <label className="form-label small fw-bold">Nombre Completo</label>
                  <input className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Correo Electrónico</label>
                  <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">
                    Contraseña {editando && "(Dejar vacío para no cambiar)"}
                  </label>
                  <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold">Rol de Sistema</label>
                  <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="usuario">Personal (Mecánico)</option>
                    <option value="admin">Administrador (Franklin/Maria)</option>
                    <option value="cliente">Cliente</option>
                  </select>
                </div>

                <button className={`btn ${editando ? 'btn-warning' : 'btn-primary'} w-100 py-2 fw-bold`} onClick={handleSubmit}>
                  {editando ? "Actualizar Datos" : "Guardar Usuario"}
                </button>
                
                {editando && (
                  <button className="btn btn-link w-100 mt-2 text-muted" onClick={cancelarEdicion}>
                    Cancelar edición
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Nombre</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id}>
                        <td className="ps-4 fw-bold">{u.nombre}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-info'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          {/* BOTÓN EDITAR */}
                          <button className="btn btn-outline-warning btn-sm me-2" onClick={() => prepararEdicion(u)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          {/* BOTÓN ELIMINAR */}
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(u.id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Usuarios;