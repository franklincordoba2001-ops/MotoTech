import { useEffect, useState, useCallback } from "react"; 
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import {
  getOrdenes,
  createOrden,
  updateOrden,
  deleteOrden,
  getMotos,
  getRepuestos,
  getOrdenRepuestos,
  saveOrdenRepuestos,
} from "../services/api";

function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [motos, setMotos] = useState([]);
  const [moto_id, setMotoId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [fecha, setFecha] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [costo, setCosto] = useState("");
  const [editId, setEditId] = useState(null);
  const [latitud, setLatitud] = useState(null);
  const [longitud, setLongitud] = useState(null);

  // Estados para módulo de repuestos
  const [catalogRepuestos, setCatalogRepuestos] = useState([]);
  const [ordenRepuestos, setOrdenRepuestos] = useState([]);
  const [selectedRepuestoId, setSelectedRepuestoId] = useState("");
  const [selectedRepuestoCant, setSelectedRepuestoCant] = useState(1);

  const token = localStorage.getItem("token");
  const rolUsuario = localStorage.getItem("rol"); // Obtenemos el rol

  const formatoCOP = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });

  const cargarOrdenes = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getOrdenes(token);
      setOrdenes(data || []);
    } catch (error) {
      console.error("Error al cargar órdenes:", error);
    }
  }, [token]);

  const cargarMotos = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getMotos(token);
      setMotos(data || []);
    } catch (error) {
      console.error("Error al cargar motos:", error);
    }
  }, [token]);

  useEffect(() => {
    cargarOrdenes();
    cargarMotos();
  }, [cargarOrdenes, cargarMotos]);

  const capturarGPS = () => {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta GPS");
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      setLatitud(pos.coords.latitude);
      setLongitud(pos.coords.longitude);
      toast.success("📍 Ubicación capturada para recogida");
    }, () => toast.error("Error al obtener ubicación. Activa los permisos."));
  };

  const handleSubmit = async () => {
    const esCliente = rolUsuario === "cliente";

    const data = { 
      moto_id: Number(moto_id), 
      descripcion, 
      // Si es cliente, autocompletamos los campos técnicos
      fecha_ingreso: esCliente ? new Date().toISOString().split('T')[0] : fecha,
      fecha_entrega: esCliente ? null : (fechaEntrega || null),
      estado: esCliente ? "pendiente" : estado, 
      costo: esCliente ? 0 : (Math.floor(Number(costo)) || 0),
      latitud,
      longitud
    };

    if (!data.moto_id || !data.descripcion) {
      toast.error("Por favor completa el ID de la moto y la descripción.");
      return;
    }

    try {
      if (editId) {
        await updateOrden(editId, data, token);
        if (rolUsuario !== "cliente") {
          await saveOrdenRepuestos(editId, ordenRepuestos, token);
        }
      } else {
        await createOrden(data, token);
      }
      
      setEditId(null); setMotoId(""); setDescripcion(""); setFecha(""); 
      setFechaEntrega(""); setCosto(""); setEstado("pendiente");
      setLatitud(null); setLongitud(null);
      setOrdenRepuestos([]);
      setSelectedRepuestoId("");
      setSelectedRepuestoCant(1);
      await cargarOrdenes();
      toast.success(esCliente ? "¡Solicitud de recogida enviada con éxito! 🛵" : "Operación exitosa");
    } catch (error) {
      console.error('Error en create/update orden:', error);
      toast.error("❌ Error: " + (error.message || "Error en el servidor"));
    }
  };

  const handleEdit = async (o) => {
    setMotoId(o.moto_id);
    setDescripcion(o.descripcion);
    setEstado(o.estado);
    setFecha(o.fecha_ingreso ? o.fecha_ingreso.split('T')[0] : ""); 
    setFechaEntrega(o.fecha_entrega ? o.fecha_entrega.split('T')[0] : "");
    setCosto(Math.floor(o.costo)); 
    setLatitud(o.latitud);
    setLongitud(o.longitud);
    setEditId(o.id);

    try {
      const repuestosOrden = await getOrdenRepuestos(o.id, token);
      setOrdenRepuestos(repuestosOrden || []);
    } catch (error) {
      console.error("Error al cargar repuestos de la orden:", error);
    }

    try {
      const cat = await getRepuestos(token);
      setCatalogRepuestos(cat || []);
    } catch (error) {
      console.error("Error al cargar catálogo de repuestos:", error);
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div>
        <p className="mb-3 text-light" style={{ fontSize: '13.5px', fontFamily: 'var(--font-sans)', lineHeight: '1.4', margin: 0 }}>
          ⚠️ <strong>¿Seguro que quieres eliminar la orden #{id}?</strong>
          <br />
          <span className="text-secondary" style={{ fontSize: '12px' }}>Esta acción es irreversible.</span>
        </p>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button 
            className="btn btn-sm btn-danger px-3 py-1.5 fw-bold"
            style={{ fontSize: '11px', borderRadius: '0px', textTransform: 'uppercase', letterSpacing: '0.5px' }}
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteOrden(id, token);
                toast.success(`✅ Orden #${id} eliminada con éxito`);
                await cargarOrdenes();
              } catch (error) {
                toast.error(error.response?.data?.error || "Error al eliminar");
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

  const handleAddRepuesto = () => {
    if (!selectedRepuestoId) {
      toast.error("Selecciona un repuesto");
      return;
    }
    const rep = catalogRepuestos.find((r) => r.id === Number(selectedRepuestoId));
    if (!rep) return;

    const existe = ordenRepuestos.find((item) => item.repuesto_id === rep.id);
    let nuevaLista;
    if (existe) {
      nuevaLista = ordenRepuestos.map((item) =>
        item.repuesto_id === rep.id
          ? { ...item, cantidad: item.cantidad + Number(selectedRepuestoCant) }
          : item
      );
    } else {
      nuevaLista = [
        ...ordenRepuestos,
        {
          repuesto_id: rep.id,
          nombre: rep.nombre,
          cantidad: Number(selectedRepuestoCant),
          precio_unitario: rep.precio_venta,
        },
      ];
    }
    setOrdenRepuestos(nuevaLista);
    
    // Recalcular costo acumulado
    const costoRepuestos = nuevaLista.reduce((acc, curr) => acc + (curr.cantidad * curr.precio_unitario), 0);
    setCosto(Math.round(costoRepuestos));

    setSelectedRepuestoId("");
    setSelectedRepuestoCant(1);
    toast.success("Repuesto añadido a la orden");
  };

  const handleRemoveRepuesto = (id) => {
    const nuevaLista = ordenRepuestos.filter((item) => item.repuesto_id !== id);
    setOrdenRepuestos(nuevaLista);

    // Recalcular costo
    const nuevoCosto = nuevaLista.reduce((acc, curr) => acc + (curr.cantidad * curr.precio_unitario), 0);
    setCosto(Math.round(nuevoCosto));

    toast.success("Repuesto removido");
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        
        {/* --- VISTA PARA EL CLIENTE (Formulario de Recogida Premium) --- */}
        {rolUsuario === "cliente" && (
          <div className="row justify-content-center mb-5">
            <div className="col-md-7 col-lg-6">
              <div className="card shadow-lg border-0 p-4 position-relative" style={{ 
                background: 'linear-gradient(135deg, rgba(20, 18, 16, 0.95) 0%, rgba(10, 9, 8, 0.98) 100%)',
                border: '1px solid rgba(229, 193, 88, 0.25) !important',
                boxShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 20px rgba(229, 193, 88, 0.05) !important'
              }}>
                {/* Decorative border line */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--accent-orange), #ffd060)' }}></div>
                
                <h2 className="text-center fw-bold mb-4 text-primary" style={{ fontFamily: 'var(--font-tech)', letterSpacing: '1px' }}>
                  Solicitar Recogida 🛵
                </h2>
                
                {motos.length === 0 ? (
                  <div className="alert alert-warning text-center py-3 mb-3" style={{ background: 'rgba(239, 159, 39, 0.1)', border: '1px solid rgba(239, 159, 39, 0.3)' }}>
                    <span style={{ fontSize: '18px' }}>⚠️</span> <span className="fw-semibold">No tienes ninguna moto registrada aún.</span>
                    <br />
                    <a href="/motos" className="btn btn-warning btn-sm mt-3 fw-bold px-4">
                      Registrar mi primera moto 🏍
                    </a>
                  </div>
                ) : (
                  <div className="mb-4">
                    <label className="form-label fw-bold" style={{ color: 'var(--accent-orange)', fontSize: '11px', letterSpacing: '1.5px' }}>Selecciona tu Moto</label>
                    <select 
                      className="form-select form-select-lg" 
                      value={moto_id} 
                      onChange={(e) => setMotoId(e.target.value)}
                      style={{ fontSize: '14.5px', padding: '12px', background: 'rgba(10, 11, 14, 0.9)' }}
                    >
                      <option value="">-- Elige una de tus motos --</option>
                      {motos.map((m) => (
                        <option key={m.id} value={m.id}>
                          🏍️ {m.placa} ({m.marca} {m.modelo})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: 'var(--accent-orange)', fontSize: '11px', letterSpacing: '1.5px' }}>¿Qué le pasa a tu moto?</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    value={descripcion} 
                    onChange={(e) => setDescripcion(e.target.value)} 
                    placeholder="Describe la falla o el servicio que necesitas brevemente..."
                    style={{ fontSize: '14px', padding: '12px', background: 'rgba(10, 11, 14, 0.9)' }}
                  ></textarea>
                </div>

                <div className="mb-4 text-center">
                  <button 
                    type="button" 
                    className={`btn ${latitud ? 'btn-success' : 'btn-warning'} w-100 py-3 fw-bold`}
                    onClick={capturarGPS}
                    style={{ 
                      fontFamily: 'var(--font-tech)', 
                      letterSpacing: '0.5px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {latitud ? "📍 UBICACIÓN GPS CAPTURADA" : "📍 ENVIAR MI UBICACIÓN PARA RECOGIDA"}
                  </button>
                  {latitud && (
                    <small className="text-success d-block mt-2 fw-semibold">
                      ✓ Coordenadas listas para Franklin: {latitud.toFixed(5)}, {longitud.toFixed(5)}
                    </small>
                  )}
                </div>

                <button 
                  className="btn btn-primary btn-lg w-100 fw-bold py-3" 
                  onClick={handleSubmit}
                  style={{ fontFamily: 'var(--font-tech)', letterSpacing: '1px' }}
                >
                  Enviar Pedido a MotoTech
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- FORMULARIO ADMIN / SUPERADMIN --- */}
        {(rolUsuario === "admin" || rolUsuario === "superadmin" || (rolUsuario === "mecanico" && editId)) && (
          <div className="card p-4 shadow-sm mb-4 border-0">
            <h5 className="text-primary mb-3 fw-bold">{editId ? `Editando Orden #${editId}` : "Nueva Orden"}</h5>
            <div className="row g-3">
              <div className="col-md-2">
                <label className="small fw-bold">Moto</label>
                <select 
                  className="form-select" 
                  value={moto_id} 
                  onChange={(e) => setMotoId(e.target.value)} 
                  disabled={rolUsuario === 'mecanico'}
                >
                  <option value="">Seleccionar...</option>
                  {motos.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.placa} ({m.marca} {m.modelo})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-7"><label className="small fw-bold">Descripción</label><input className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} /></div>
              <div className="col-md-3"><label className="small fw-bold">Estado</label><select className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)}><option value="pendiente">Pendiente</option><option value="en_proceso">En proceso</option><option value="terminado">Terminado</option><option value="entregado">Entregado</option></select></div>
              <div className="col-md-4"><label className="small fw-bold">Ingreso</label><input type="date" className="form-control" value={fecha} onChange={(e) => setFecha(e.target.value)} disabled={rolUsuario === 'mecanico'} /></div>
              <div className="col-md-4"><label className="small fw-bold">Entrega</label><input type="date" className="form-control" value={fechaEntrega} onChange={(e) => setFechaEntrega(e.target.value)} disabled={rolUsuario === 'mecanico'} /></div>
              <div className="col-md-4"><label className="small fw-bold">Costo</label><input type="number" className="form-control" value={costo} onChange={(e) => setCosto(e.target.value)} /></div>
            </div>

            {/* Sección de Repuestos (Solo al editar) */}
            {editId && (
              <div className="mt-4 pt-4 border-top">
                <h6 className="text-secondary fw-bold mb-3">🛠️ Repuestos asignados a esta reparación</h6>
                <div className="row g-2 align-items-end mb-3">
                  <div className="col-md-6">
                    <label className="small fw-bold">Seleccionar Repuesto</label>
                    <select
                      className="form-select"
                      value={selectedRepuestoId}
                      onChange={(e) => setSelectedRepuestoId(e.target.value)}
                    >
                      <option value="">-- Elige un repuesto del inventario --</option>
                      {catalogRepuestos.map((r) => (
                        <option key={r.id} value={r.id} disabled={r.stock <= 0}>
                          {r.nombre} ({formatoCOP.format(r.precio_venta)}) - Stock: {r.stock}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="small fw-bold">Cantidad</label>
                    <input
                      type="number"
                      className="form-control"
                      value={selectedRepuestoCant}
                      min="1"
                      onChange={(e) => setSelectedRepuestoCant(Number(e.target.value))}
                    />
                  </div>
                  <div className="col-md-4">
                    <button
                      type="button"
                      className="btn btn-outline-success w-100"
                      onClick={handleAddRepuesto}
                    >
                      + Añadir Repuesto
                    </button>
                  </div>
                </div>

                {/* Tabla de repuestos agregados */}
                {ordenRepuestos.length === 0 ? (
                  <p className="text-muted small">No se han añadido repuestos a esta orden.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm table-dark table-hover mb-0" style={{ fontSize: '13px' }}>
                      <thead>
                        <tr>
                          <th>Repuesto</th>
                          <th>Precio Unitario</th>
                          <th className="text-center">Cant.</th>
                          <th className="text-end">Subtotal</th>
                          <th className="text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordenRepuestos.map((item) => (
                          <tr key={item.repuesto_id}>
                            <td>{item.nombre}</td>
                            <td>{formatoCOP.format(item.precio_unitario)}</td>
                            <td className="text-center">{item.cantidad}</td>
                            <td className="text-end fw-bold">{formatoCOP.format(item.cantidad * item.precio_unitario)}</td>
                            <td className="text-center">
                              <button
                                type="button"
                                className="btn btn-sm btn-link text-danger p-0"
                                onClick={() => handleRemoveRepuesto(item.repuesto_id)}
                              >
                                Remover
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr className="table-secondary text-dark fw-bold">
                          <td colSpan="3">Total Repuestos:</td>
                          <td className="text-end">
                            {formatoCOP.format(
                              ordenRepuestos.reduce((acc, curr) => acc + curr.cantidad * curr.precio_unitario, 0)
                            )}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            <button className={`btn ${editId ? 'btn-warning' : 'btn-primary'} mt-4 px-5`} onClick={handleSubmit}>{editId ? "Actualizar" : "Registrar"}</button>
          </div>
        )}

        {/* --- LISTADO / HISTORIAL --- */}
        {rolUsuario === "cliente" ? (
          <div className="mt-5">
            <h3 className="mb-4 fw-bold text-light text-center text-md-start" style={{ fontFamily: 'var(--font-tech)', letterSpacing: '1px' }}>
              🛠️ Mis Órdenes e Historial
            </h3>
            
            {ordenes.length === 0 ? (
              <div className="card p-5 text-center border-0" style={{ background: 'var(--bg-card)', border: '1px dashed rgba(255,255,255,0.1) !important' }}>
                <p className="text-secondary mb-0" style={{ fontStyle: 'italic' }}>
                  No tienes ninguna solicitud de servicio registrada aún.
                </p>
              </div>
            ) : (
              <div className="row g-4">
                {ordenes.map((o) => (
                  <div key={o.id} className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow border-0 p-4 position-relative" style={{ 
                      background: 'var(--bg-card)', 
                      border: '1px solid var(--border-color)',
                      transition: 'all 0.25s ease'
                    }}>
                      {/* Status Badge in corner */}
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className={`badge rounded-pill ${
                          o.estado === 'entregado' ? 'bg-success' : 
                          o.estado === 'terminado' ? 'bg-primary' : 
                          o.estado === 'en_proceso' ? 'bg-info' : 
                          o.estado === 'pendiente' ? 'bg-warning' : 
                          'bg-secondary'
                        }`} style={{ fontSize: '10px', padding: '6px 12px' }}>
                          {o.estado}
                        </span>
                      </div>

                      {/* Header of card */}
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span className="text-primary fw-bold" style={{ fontFamily: 'var(--font-tech)', fontSize: '17px' }}>
                          #{o.id}
                        </span>
                        <span className="text-muted" style={{ fontSize: '12px' }}>|</span>
                        <span className="text-secondary fw-bold" style={{ fontSize: '14.5px' }}>
                          🏍️ {o.placa ? o.placa : `Moto ID: ${o.moto_id}`}
                        </span>
                      </div>

                      {/* Bike Brand and Model info */}
                      {(o.marca || o.modelo) && (
                        <div className="mb-3 p-2 rounded" style={{ background: 'rgba(255,255,255,0.03)', fontSize: '13px', borderLeft: '2px solid var(--accent-cyan)' }}>
                          <span className="text-muted">Vehículo:</span> <strong className="text-light">{o.marca} {o.modelo}</strong>
                        </div>
                      )}

                      {/* Description */}
                      <div className="mb-3">
                        <label className="small text-muted d-block mb-1" style={{ fontSize: '10.5px', letterSpacing: '0.5px' }}>Reporte de Falla</label>
                        <p className="text-secondary bg-dark p-3 rounded-0 mb-0" style={{ 
                          fontSize: '13px', 
                          minHeight: '65px', 
                          lineHeight: '1.4',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          borderLeft: '3px solid var(--accent-orange)',
                          background: 'rgba(0,0,0,0.2) !important'
                        }}>
                          "{o.descripcion}"
                        </p>
                      </div>

                      {/* Repuestos cambiados (Cliente) */}
                      {o.repuestos_detalle && (
                        <div className="mb-3">
                          <label className="small text-muted d-block mb-1" style={{ fontSize: '10.5px', letterSpacing: '0.5px' }}>Repuestos Cambiados</label>
                          <div className="p-2 rounded-0 text-secondary bg-dark" style={{ 
                            fontSize: '12px', 
                            lineHeight: '1.4',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderLeft: '3px solid #00d2ff',
                            background: 'rgba(0,0,0,0.2) !important'
                          }}>
                            🔧 {o.repuestos_detalle}
                          </div>
                        </div>
                      )}

                      {/* Cost and Date */}
                      <div className="mt-auto pt-3 border-top border-secondary d-flex justify-content-between align-items-center" style={{ borderColor: 'rgba(255,255,255,0.06) !important' }}>
                        <div>
                          <span className="text-muted d-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Costo Total</span>
                          <span className="fw-bold text-success" style={{ fontSize: '17px', fontFamily: 'var(--font-tech)' }}>
                            {o.costo > 0 ? formatoCOP.format(o.costo) : 'Cotizando... ⏳'}
                          </span>
                        </div>
                        <div className="text-end">
                          <span className="text-muted d-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fecha Ingreso</span>
                          <span className="text-secondary" style={{ fontSize: '12px', fontWeight: '500' }}>
                            {o.fecha_ingreso ? o.fecha_ingreso.split('T')[0] : 'Pendiente'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* --- TABLA DE ÓRDENES (Para Admins/Mecánicos) --- */
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white">
              <h4 className="mb-0 fw-bold">Listado de Órdenes</h4>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr><th>ID</th><th>Moto</th><th>Descripción</th><th>Estado</th><th>Costo</th><th className="text-center">Acciones</th></tr>
                </thead>
                <tbody>
                  {ordenes.map((o) => (
                    <tr key={o.id}>
                      <td><strong>#{o.id}</strong></td>
                      <td>{o.placa ? o.placa : `ID: ${o.moto_id}`}</td>
                      <td>
                          {o.descripcion}
                          {o.repuestos_detalle && (
                            <div className="mt-1 text-muted" style={{ fontSize: '12.5px' }}>
                              <span className="text-info">🔧 Repuestos:</span> {o.repuestos_detalle}
                            </div>
                          )}
                          {o.latitud && (
                            <div className="mt-1"><a href={`https://www.google.com/maps?q=${o.latitud},${o.longitud}`} target="_blank" rel="noreferrer" className="badge bg-info text-decoration-none">📍 Ver Ruta Recogida</a></div>
                          )}
                      </td>
                      <td>
                        <span className={`badge rounded-pill ${
                          o.estado === 'entregado' ? 'bg-success' : 
                          o.estado === 'terminado' ? 'bg-primary' : 
                          o.estado === 'en_proceso' ? 'bg-info' : 
                          o.estado === 'pendiente' ? 'bg-warning' : 
                          'bg-secondary'
                        }`}>
                          {o.estado}
                        </span>
                      </td>
                      <td className="fw-bold">{formatoCOP.format(o.costo)}</td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(o)}>Editar</button>
                        {(rolUsuario === "admin" || rolUsuario === "superadmin") && (
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(o.id)}>Eliminar</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Ordenes;