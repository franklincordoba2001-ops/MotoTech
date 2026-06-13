import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import {
  getFacturas,
  createFactura,
  deleteFactura,
  descargarFacturaPDF 
} from "../services/api";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

function Facturas() {
  const [facturas, setFacturas] = useState([]);
  const [orden_id, setOrdenId] = useState("");
  const [total, setTotal] = useState("");
  const [metodo_pago, setMetodoPago] = useState("efectivo");
  const [fecha, setFecha] = useState("");

  const token = localStorage.getItem("token");
  const rolUsuario = localStorage.getItem("rol") || localStorage.getItem("role") || "";

  const formatoCOP = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  });

  const cargarFacturas = useCallback(async () => {
    try {
      const data = await getFacturas(token);
      setFacturas(data || []);
    } catch (error) {
      console.error("Error al cargar facturas:", error);
    }
  }, [token]);

  useEffect(() => {
    cargarFacturas();
  }, [cargarFacturas]);

  
  const handleDescargarPDF = async (id) => {
    try {
      const blob = await descargarFacturaPDF(id, token);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Factura_MotoTech_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("❌ No se pudo descargar el PDF. Revisa el servidor.");
    }
  };

  const handleSubmit = async () => {
    if (!orden_id || !total || !fecha) {
      toast.error("Completa todos los campos");
      return;
    }

    const totalNumerico = Math.floor(Number(total));

    try {
      await createFactura(
        { orden_id: Number(orden_id), total: totalNumerico, metodo_pago, fecha },
        token
      );
      setOrdenId("");
      setTotal("");
      setMetodoPago("efectivo");
      setFecha("");
      cargarFacturas();
      toast.success("✅ Factura registrada con éxito");
    } catch (error) {
      console.error('Error creando factura:', error);
      toast.error("❌ Error: " + (error.message || "No se pudo crear la factura"));
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div>
        <p className="mb-3 text-light" style={{ fontSize: '13.5px', fontFamily: 'var(--font-sans)', lineHeight: '1.4', margin: 0 }}>
          ⚠️ <strong>¿Estás seguro de eliminar la factura #{id}?</strong>
          <br />
          <span className="text-secondary" style={{ fontSize: '12px' }}>Esta acción marcará la factura como eliminada (soft delete). Solo el superadmin puede realizar esta acción.</span>
        </p>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button 
            className="btn btn-sm btn-danger px-3 py-1.5 fw-bold"
            style={{ fontSize: '11px', borderRadius: '0px', textTransform: 'uppercase', letterSpacing: '0.5px' }}
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteFactura(id, token);
                toast.success(`✅ Factura #${id} marcada como eliminada`);
                cargarFacturas();
              } catch (error) {
                toast.error("Hubo un problema al eliminar la factura.");
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
      duration: 10000,
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

      <div className="container py-4">
        <h2 className="mb-4 fw-bold text-dark">
          <i className="bi bi-receipt-cutoff me-2 text-success"></i>
          Gestión de Facturación
        </h2>

        {/* FORMULARIO */}
        {rolUsuario !== "cliente" && (
          <div className="card p-4 shadow-sm mb-4 border-0 rounded-4">
            <h5 className="mb-4 text-success fw-bold">Nueva Factura</h5>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label small fw-bold">ID Orden</label>
                <input
                  className="form-control rounded-3"
                  placeholder="Ej: 7"
                  value={orden_id}
                  onChange={(e) => setOrdenId(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">Total ($)</label>
                <input
                  type="number"
                  className="form-control rounded-3"
                  placeholder="80000"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">Método de Pago</label>
                <select
                  className="form-select rounded-3"
                  value={metodo_pago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">Fecha</label>
                <input
                  type="date"
                  className="form-control rounded-3"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </div>
            </div>
            <button className="btn btn-success mt-4 px-5 fw-bold rounded-pill" onClick={handleSubmit}>
              Registrar Factura
            </button>
          </div>
        )}

        {/* TABLA */}
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="ps-4">ID</th>
                  <th>Orden</th>
                  <th>Total</th>
                  <th>Método</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((f) => {
                  const currentId = f.factura_id || f.id;
                  const estado = f.estado || 'activa';
                  
                  let estadoIcon, estadoColor, estadoLabel;
                  if (estado === 'eliminada') {
                    estadoIcon = <XCircle size={16} />;
                    estadoColor = '#dc3545';
                    estadoLabel = 'Eliminada';
                  } else if (estado === 'anulada') {
                    estadoIcon = <AlertTriangle size={16} />;
                    estadoColor = '#ffc107';
                    estadoLabel = 'Anulada';
                  } else {
                    estadoIcon = <CheckCircle size={16} />;
                    estadoColor = '#00e88f';
                    estadoLabel = 'Activa';
                  }

                  return (
                    <tr key={currentId}>
                      <td className="ps-4 fw-bold text-muted">#{currentId}</td>
                      <td>
                         <span className="badge bg-secondary-subtle text-secondary px-3 py-2">
                           Orden #{f.orden_id}
                         </span>
                      </td>
                      <td className="text-success fw-bold">
                        {formatoCOP.format(f.total)}
                      </td>
                      <td>
                        <span className="text-capitalize small fw-bold">
                          {f.metodo_pago}
                        </span>
                      </td>
                      <td>{new Date(f.fecha).toLocaleDateString()}</td>
                      <td>
                        <div 
                          className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                          style={{ 
                            backgroundColor: `${estadoColor}20`,
                            border: `1px solid ${estadoColor}40`,
                            color: estadoColor
                          }}
                        >
                          {estadoIcon}
                          <span className="small fw-bold">{estadoLabel}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        {/* BOTÓN DE PDF */}
                        <button 
                          className="btn btn-outline-danger btn-sm me-2 rounded-pill px-3"
                          onClick={() => handleDescargarPDF(currentId)}
                          title="Bajar Factura"
                        >
                          <i className="bi bi-file-pdf-fill me-1"></i>
                          PDF
                        </button>

                        {rolUsuario === "superadmin" && (
                          <button
                            className="btn btn-light btn-sm rounded-circle text-danger"
                            onClick={() => handleDelete(currentId)}
                            title="Eliminar factura (solo superadmin)"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
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
  );
}

export default Facturas;