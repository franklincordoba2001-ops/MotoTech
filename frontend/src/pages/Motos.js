import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { getMotos, createMoto, getClientes, deleteMoto, getOrdenes } from "../services/api";
import { CheckCircle, Clock, Wrench } from "lucide-react";

function Motos() {
  const [motos, setMotos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [placa, setPlaca] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [cilindraje, setCilindraje] = useState("");
  const [clienteId, setClienteId] = useState("");

  const token = localStorage.getItem("token");
  const rolUsuario = localStorage.getItem("rol");
  const usuarioIdLogueado = localStorage.getItem("usuario_id");

  const cargarDatos = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        getMotos(token),
        (rolUsuario === "admin" || rolUsuario === "usuario") ? getClientes(token) : Promise.resolve([]),
        getOrdenes(token),
      ]);

      if (results[0].status === "fulfilled") setMotos(results[0].value || []);
      else {
        console.error("Error cargando motos:", results[0].reason);
        setMotos([]);
      }

      if (results[1].status === "fulfilled") setClientes(results[1].value || []);
      else {
        console.warn("No se pudieron obtener clientes:", results[1].reason);
        setClientes([]);
      }

      if (results[2].status === "fulfilled") setOrdenes(results[2].value || []);
      else {
        console.warn("No se pudieron obtener ordenes:", results[2].reason);
        setOrdenes([]);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  }, [token, rolUsuario]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Función para determinar el estado de una moto basado en sus órdenes
  const getEstadoMoto = (motoId) => {
    const ordenesMoto = ordenes.filter(o => o.moto_id === motoId);
    if (ordenesMoto.length === 0) return { estado: 'sin_orden', label: 'Sin orden', icon: Clock, color: '#6e737c' };
    
    // Buscar la orden más reciente
    const ordenMasReciente = ordenesMoto.sort((a, b) => new Date(b.fecha_ingreso) - new Date(a.fecha_ingreso))[0];
    
    if (ordenMasReciente.estado === 'terminado' || ordenMasReciente.estado === 'entregado') {
      return { estado: 'lista', label: 'Lista', icon: CheckCircle, color: '#00e88f' };
    } else if (ordenMasReciente.estado === 'en_proceso') {
      return { estado: 'en_proceso', label: 'En proceso', icon: Wrench, color: '#e5c158' };
    } else {
      return { estado: 'pendiente', label: 'Pendiente', icon: Clock, color: '#6e737c' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const esCliente = rolUsuario === "cliente";

    if (!placa || !marca) {
      toast.error("Por favor completa placa y marca");
      return;
    }
    if (!esCliente && !clienteId) {
      toast.error("Selecciona el cliente responsable");
      return;
    }

    try {
      const resp = await createMoto(
        {
          placa: placa.toUpperCase(),
          marca,
          modelo,
          cilindraje: Number(cilindraje) || 0,
          cliente_id: esCliente ? Number(usuarioIdLogueado) : Number(clienteId),
        },
        token
      );

      console.log("createMoto response:", resp);
      const newId = resp?.id || resp?.insertId || resp?.insert_id || null;
      toast.success("✅ Moto guardada correctamente" + (newId ? " (ID: " + newId + ")" : ""));
      setPlaca("");
      setMarca("");
      setModelo("");
      setCilindraje("");
      setClienteId("");
      await cargarDatos();
    } catch (error) {
      console.error("Error creando moto:", error);
      toast.error("❌ Error al registrar: " + (error.message || error));
    }
  };

  const handleDeleteMoto = (id) => {
    toast((t) => (
      <div>
        <p className="mb-3 text-light" style={{ fontSize: '13.5px', fontFamily: 'var(--font-sans)', lineHeight: '1.4', margin: 0 }}>
          ⚠️ <strong>¿Eliminar moto?</strong>
          <br />
          <span className="text-secondary" style={{ fontSize: '12px' }}>Esta acción no se puede deshacer.</span>
        </p>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button 
            className="btn btn-sm btn-danger px-3 py-1.5 fw-bold"
            style={{ fontSize: '11px', borderRadius: '0px', textTransform: 'uppercase', letterSpacing: '0.5px' }}
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteMoto(id, token);
                toast.success("✅ Moto eliminada correctamente");
                await cargarDatos();
              } catch (error) {
                console.error("Error eliminando moto:", error);
                const msg = error?.message || "";
                if (msg.toLowerCase().includes("foreign") || msg.toLowerCase().includes("constraint")) {
                  toast.error("❌ No se puede eliminar la moto porque tiene órdenes asociadas. Elimina las órdenes relacionadas primero.");
                } else {
                  toast.error("❌ Error al eliminar la moto: " + (msg || "revisa la consola"));
                }
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
          {rolUsuario !== "mecanico" && (
            <div className="col-lg-4">
              <div className="card shadow-sm p-4 rounded-4 border-0">
                <h5 className="fw-bold mb-3 text-primary">{rolUsuario === "cliente" ? "Registrar Mi Moto" : "Registrar Moto Nueva"}</h5>
              <form onSubmit={handleSubmit}>
                {rolUsuario === "cliente" && (
                  <div className="mb-3">
                    <label className="small fw-bold">Propietario (tú)</label>
                    <input
                      className="form-control mb-2"
                      value={`${localStorage.getItem("nombre") || ""} (ID: ${localStorage.getItem("usuario_id") || ""})`}
                      readOnly
                    />
                  </div>
                )}

                <label className="small fw-bold">Placa</label>
                <input className="form-control mb-2" placeholder="ABC123" value={placa} onChange={(e) => setPlaca(e.target.value.toUpperCase())} required />

                <label className="small fw-bold">Marca</label>
                <input className="form-control mb-2" placeholder="Ej: Yamaha" value={marca} onChange={(e) => setMarca(e.target.value)} required />

                <label className="small fw-bold">Modelo / Línea</label>
                <input className="form-control mb-2" placeholder="Ej: FZ 2.0" value={modelo} onChange={(e) => setModelo(e.target.value)} />

                <label className="small fw-bold">Cilindraje (cc)</label>
                <input className="form-control mb-2" type="number" placeholder="Ej: 150" value={cilindraje} onChange={(e) => setCilindraje(e.target.value)} />

                {(rolUsuario === "admin" || rolUsuario === "usuario") && (
                  <>
                    <label className="small fw-bold mt-2 text-danger">Asignar a Cliente:</label>
                    <select className="form-select mb-3 border-danger" value={clienteId} onChange={(e) => setClienteId(e.target.value)} required>
                      <option value="">Selecciona el cliente...</option>
                      {clientes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre} (ID: {c.id})
                        </option>
                      ))}
                    </select>
                  </>
                )}

                <button type="submit" className="btn btn-primary w-100 fw-bold mt-3 py-2 shadow-sm">
                  {rolUsuario === "cliente" ? "Registrar Mi Moto" : "Guardar Moto"}
                </button>
              </form>
            </div>
          </div>
          )}

          <div className="col-lg-8">
            <div className="card shadow-sm rounded-4 overflow-hidden border-0">
              <div className="bg-dark p-3">
                <h6 className="text-white mb-0 fw-bold">{rolUsuario === "cliente" ? "Mis Motos Registradas" : "Inventario Total de Motos"}</h6>
              </div>
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4 small">PLACA</th>
                    <th className="small">MARCA/MODELO</th>
                    <th className="small text-center">CC</th>
                    {rolUsuario === "mecanico" && <th className="small text-center">ESTADO</th>}
                    {(rolUsuario === "admin" || rolUsuario === "superadmin") && <th className="small">DUEÑO</th>}
                    {(rolUsuario === "superadmin" || rolUsuario === "admin") && <th className="text-center small">ACCIÓN</th>}
                  </tr>
                </thead>
                <tbody>
                  {motos.length > 0 ? (
                    motos.map((m) => {
                      const estadoMoto = getEstadoMoto(m.id);
                      const EstadoIcon = estadoMoto.icon;
                      return (
                        <tr key={m.id}>
                          <td className="ps-4 fw-bold text-primary">{m.placa}</td>
                          <td>
                            {m.marca} <span className="text-muted">| {m.modelo}</span>
                          </td>
                          <td className="text-center">{m.cilindraje}cc</td>
                          {rolUsuario === "mecanico" && (
                            <td className="text-center">
                              <div 
                                className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                                style={{ 
                                  backgroundColor: `${estadoMoto.color}20`,
                                  border: `1px solid ${estadoMoto.color}40`,
                                  color: estadoMoto.color
                                }}
                              >
                                <EstadoIcon size={16} />
                                <span className="small fw-bold">{estadoMoto.label}</span>
                              </div>
                            </td>
                          )}
                          {(rolUsuario === "admin" || rolUsuario === "superadmin") && <td className="small text-muted">{m.cliente_nombre || `ID: ${m.cliente_id}`}</td>}
                          {(rolUsuario === "superadmin" || rolUsuario === "admin") && (
                            <td className="text-center">
                              <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => handleDeleteMoto(m.id)}>
                                <i className="bi bi-trash"></i> Borrar
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={rolUsuario === "mecanico" ? 4 : 5} className="text-center py-4 text-muted small">
                        No hay motos registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Motos;