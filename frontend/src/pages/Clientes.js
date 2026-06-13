import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../services/api";

const AVATAR_COLORS = [
  { bg: "#e6faf2", color: "#0a7a4a" },
  { bg: "#e6f1fb", color: "#0c447c" },
  { bg: "#eeedfe", color: "#3c3489" },
  { bg: "#faece7", color: "#712b13" },
];

function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
}

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  const cargarClientes = useCallback(async () => {
    try {
      const data = await getClientes(token);
      setClientes(data || []);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  }, [token]);

  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

  const handleSubmit = async () => {
    if (!nombre || !telefono) {
      toast.error("⚠️ Por favor, ingresa el nombre y el teléfono.");
      return;
    }
    try {
      if (editId) {
        await updateCliente(editId, { nombre, telefono, direccion, email }, token);
        toast.success("✅ Cliente actualizado con éxito");
        setEditId(null);
      } else {
        await createCliente({ nombre, telefono, direccion, email }, token);
        toast.success("✅ Cliente registrado con éxito");
      }
      setNombre("");
      setTelefono("");
      setDireccion("");
      setEmail("");
      cargarClientes();
    } catch (error) {
      console.error('Error en create/update cliente:', error);
      toast.error("❌ Error: " + (error.message || "No se pudo procesar la solicitud"));
    }
  };

  const handleEdit = (cliente) => {
    setNombre(cliente.nombre);
    setTelefono(cliente.telefono);
    setDireccion(cliente.direccion || "");
    setEmail(cliente.email || "");
    setEditId(cliente.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div>
        <p className="mb-3 text-light" style={{ fontSize: '13.5px', fontFamily: 'var(--font-sans)', lineHeight: '1.4', margin: 0 }}>
          ⚠️ <strong>¿Estás seguro de eliminar este cliente?</strong>
          <br />
          <span className="text-secondary" style={{ fontSize: '12px' }}>Esto podría afectar a sus motos registradas.</span>
        </p>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button 
            className="btn btn-sm btn-danger px-3 py-1.5 fw-bold"
            style={{ fontSize: '11px', borderRadius: '0px', textTransform: 'uppercase', letterSpacing: '0.5px' }}
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteCliente(id, token);
                toast.success("✅ Cliente eliminado con éxito");
                cargarClientes();
              } catch {
                toast.error("❌ No se puede eliminar: el cliente tiene motos asociadas.");
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

  const cancelarEdicion = () => {
    setEditId(null);
    setNombre("");
    setTelefono("");
    setDireccion("");
    setEmail("");
  };

  const isEditing = editId !== null;

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.main}>
        {/* ENCABEZADO */}
        <div style={styles.pageHeader}>
          <div>
            <h2 style={styles.pageTitle}>
              Directorio de Clientes{" "}
              <span style={styles.pageTitleSub}>/ gestión de propietarios</span>
            </h2>
          </div>
          <span style={styles.badgeCount}>{clientes.length} clientes registrados</span>
        </div>

        <div style={styles.grid}>
          {/* FORMULARIO */}
          <div style={styles.card}>
            <div style={{ ...styles.cardHeader, borderLeft: isEditing ? "3px solid #ef9f27" : "3px solid #00b96b" }}>
              <div style={{ ...styles.cardHeaderIcon, background: isEditing ? "#faeeda" : "#e6faf2", color: isEditing ? "#854f0b" : "#0a7a4a" }}>
                {isEditing ? "✏" : "+"}
              </div>
              <div>
                <div style={styles.cardHeaderTitle}>
                  {isEditing ? "Editando cliente" : "Nuevo cliente"}
                </div>
                <div style={styles.cardHeaderSub}>
                  {isEditing ? "Modifica y guarda los cambios" : "Completa los campos para registrar"}
                </div>
              </div>
            </div>

            <div style={styles.cardBody}>
              {isEditing && (
                <div style={styles.editAlert}>
                  <div style={styles.editAlertDot} />
                  <span>Modo edición activo — modifica los campos y guarda</span>
                </div>
              )}

              <div style={styles.fieldLabel}>Nombre del propietario</div>
              <div style={styles.inputRow}>
                <div style={styles.inputIcon}>👤</div>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Nombre completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div style={styles.fieldLabel}>Teléfono / WhatsApp</div>
              <div style={styles.inputRow}>
                <div style={styles.inputIcon}>📱</div>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="300 123 4567"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>

              <div style={styles.fieldLabel}>Dirección de residencia</div>
              <div style={styles.inputRow}>
                <div style={styles.inputIcon}>📍</div>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Calle 123 #45-67"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>

              <div style={styles.fieldLabel}>Correo Electrónico</div>
              <div style={styles.inputRow}>
                <div style={styles.inputIcon}>📧</div>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="cliente@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                style={{ ...styles.btnMain, background: isEditing ? "#ef9f27" : "#00b96b" }}
                onClick={handleSubmit}
              >
                <span>{isEditing ? "✓" : "+"}</span>
                <span>{isEditing ? "Guardar cambios" : "Registrar cliente"}</span>
              </button>

              {isEditing && (
                <button style={styles.btnOutline} onClick={cancelarEdicion}>
                  Cancelar edición
                </button>
              )}
            </div>
          </div>

          {/* TABLA */}
          <div style={styles.card}>
            <div style={{ ...styles.cardHeader, borderLeft: "3px solid #00b96b" }}>
              <div style={{ ...styles.cardHeaderIcon, background: "#e6faf2", color: "#0a7a4a" }}>☰</div>
              <div>
                <div style={styles.cardHeaderTitle}>Clientes registrados</div>
                <div style={styles.cardHeaderSub}>
                  {clientes.length} propietarios en MotoTech
                </div>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>CLIENTE</th>
                    <th style={styles.th}>CONTACTO</th>
                    <th style={{ ...styles.th, textAlign: "center" }}>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.length === 0 && (
                    <tr>
                      <td colSpan="4" style={styles.emptyState}>
                        <div style={{ fontSize: 32, marginBottom: 10 }}>🏍</div>
                        <div>No hay clientes registrados en MotoTech.</div>
                      </td>
                    </tr>
                  )}
                  {clientes.map((c, i) => {
                    const av = AVATAR_COLORS[i % AVATAR_COLORS.length];
                    const isEditingRow = editId === c.id;
                    return (
                      <tr
                        key={c.id}
                        style={{
                          ...styles.tr,
                          background: isEditingRow ? "rgba(239,159,39,0.06)" : "transparent",
                        }}
                      >
                        <td style={styles.td}>
                          <span style={styles.idPill}>#{String(c.id).padStart(3, "0")}</span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.nameCell}>
                            <div style={{ ...styles.avatar, background: av.bg, color: av.color }}>
                              {initials(c.nombre)}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={styles.namePrimary}>{c.nombre}</span>
                              {c.email && (
                                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  📧 {c.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <a
                              href={`https://wa.me/57${c.telefono}`}
                              target="_blank"
                              rel="noreferrer"
                              style={styles.waLink}
                            >
                              <div style={styles.waDot} />
                              {c.telefono}
                            </a>
                            {c.direccion && (
                              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                📍 {c.direccion}
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ ...styles.td, textAlign: "center" }}>
                          <button
                            style={{ ...styles.btnIcon, background: "#faeeda", color: "#854f0b" }}
                            onClick={() => handleEdit(c)}
                            title="Editar"
                          >
                            ✏️
                          </button>{" "}
                          <button
                            style={{ ...styles.btnIcon, background: "#fcebeb", color: "#a32d2d" }}
                            onClick={() => handleDelete(c.id)}
                            title="Eliminar"
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: "transparent",
    minHeight: "100vh",
  },
  main: {
    padding: "28px 24px",
  },
  pageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#fff",
    margin: 0,
    fontFamily: "var(--font-tech)",
  },
  pageTitleSub: {
    color: "var(--text-secondary)",
    fontWeight: 400,
    fontSize: 14,
    marginLeft: 8,
  },
  badgeCount: {
    background: "rgba(255, 95, 0, 0.15)",
    color: "var(--accent-orange)",
    fontSize: 12,
    fontWeight: 600,
    padding: "5px 14px",
    borderRadius: 0,
    border: "1px solid var(--border-color)",
    fontFamily: "var(--font-tech)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 20,
    alignItems: "start",
  },
  card: {
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: 0,
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
  },
  cardHeader: {
    padding: "18px 20px 14px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  cardHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 600,
    flexShrink: 0,
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#fff",
    fontFamily: "var(--font-tech)",
  },
  cardHeaderSub: {
    fontSize: 12,
    color: "var(--text-secondary)",
  },
  cardBody: {
    padding: 20,
  },
  editAlert: {
    background: "rgba(239, 159, 39, 0.15)",
    border: "1px solid #ef9f27",
    borderRadius: 0,
    padding: "10px 14px",
    marginBottom: 16,
    fontSize: 12,
    color: "#ef9f27",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  editAlertDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#ef9f27",
    flexShrink: 0,
  },
  fieldLabel: {
    fontSize: 12,
    color: "var(--text-secondary)",
    fontWeight: 600,
    marginBottom: 6,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: 0,
    overflow: "hidden",
    background: "rgba(10, 11, 14, 0.8)",
    marginBottom: 14,
  },
  inputIcon: {
    padding: "0 12px",
    fontSize: 13,
    background: "rgba(255, 255, 255, 0.02)",
    height: 38,
    display: "flex",
    alignItems: "center",
    borderRight: "1px solid rgba(255, 255, 255, 0.05)",
    color: "var(--accent-orange)",
  },
  input: {
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "0 12px",
    height: 38,
    fontSize: 14,
    color: "#fff",
    width: "100%",
    fontFamily: "inherit",
  },
  btnMain: {
    width: "100%",
    padding: "12px",
    borderRadius: 0,
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    border: "none",
    color: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: "var(--font-tech)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  },
  btnOutline: {
    width: "100%",
    padding: "10px",
    borderRadius: 0,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    background: "transparent",
    color: "var(--text-secondary)",
    marginTop: 8,
    fontFamily: "var(--font-tech)",
    textTransform: "uppercase",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thead: {
    borderBottom: "1px solid var(--border-color)",
    background: "rgba(0, 0, 0, 0.2)",
  },
  th: {
    padding: "14px 16px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 600,
    color: "var(--text-secondary)",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontFamily: "var(--font-tech)",
  },
  tr: {
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    transition: "background-color 0.2s",
  },
  td: {
    padding: "14px 16px",
    fontSize: 14,
    color: "var(--text-primary)",
  },
  idPill: {
    fontSize: 11,
    color: "var(--accent-orange)",
    background: "rgba(255, 95, 0, 0.1)",
    border: "1px solid rgba(255, 95, 0, 0.2)",
    padding: "2px 8px",
    borderRadius: 0,
    fontFamily: "var(--font-tech)",
  },
  nameCell: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  namePrimary: {
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
  },
  waLink: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "var(--accent-green)",
    textDecoration: "none",
    fontSize: 13,
    fontWeight: 500,
  },
  waDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "var(--accent-green)",
    flexShrink: 0,
  },
  btnIcon: {
    width: 30,
    height: 30,
    borderRadius: 0,
    border: "none",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
  },
  emptyState: {
    textAlign: "center",
    padding: "48px 0",
    color: "var(--text-secondary)",
    fontSize: 14,
  },
};

export default Clientes;