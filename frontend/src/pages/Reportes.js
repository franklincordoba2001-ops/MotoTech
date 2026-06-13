import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getClientes, getOrdenes, getFacturas, getUsuarios } from "../services/api";

function Reportes() {
  const [stats, setStats] = useState({ clientes: 0, ordenes: 0, facturas: 0, usuarios: 0, ingresos: 0 });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const cargar = async () => {
      try {
        const [c, o, f, u] = await Promise.all([getClientes(token), getOrdenes(token), getFacturas(token), getUsuarios(token)]);
        const ingresos = (f || []).reduce((acc, cur) => acc + Number(cur.total || 0), 0);
        setStats({ clientes: c.length, ordenes: o.length, facturas: f.length, usuarios: u.length, ingresos });
      } catch (e) {
        console.error(e);
      }
    };
    cargar();
  }, [token]);

  return (
    <div className="min-vh-100">
      <Navbar />
      <div className="container py-5">
        <h2 className="fw-bold mb-4">Reportes rápidos</h2>

        <div className="row g-3">
          <div className="col-md-3">
            <div className="card p-3 shadow-sm">
              <div className="text-muted small">Clientes</div>
              <div className="fs-4 fw-bold">{stats.clientes}</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card p-3 shadow-sm">
              <div className="text-muted small">Órdenes</div>
              <div className="fs-4 fw-bold">{stats.ordenes}</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card p-3 shadow-sm">
              <div className="text-muted small">Facturas</div>
              <div className="fs-4 fw-bold">{stats.facturas}</div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card p-3 shadow-sm">
              <div className="text-muted small">Ingresos</div>
              <div className="fs-4 fw-bold text-success">${stats.ingresos.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reportes;
