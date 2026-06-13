import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getUbicacionTaller } from "../services/api";

function Config() {
  const [ubicacion, setUbicacion] = useState(null);
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getUbicacionTaller();
        setUbicacion(data);
      } catch (e) {
        console.error(e);
      }
    };
    cargar();
  }, []);

  return (
    <div className="min-vh-100">
      <Navbar />
      <div className="container py-5">
        <h2 className="fw-bold mb-3">Configuración y ubicación</h2>
        {ubicacion ? (
          <div className="card p-4 shadow-sm">
            <h5 className="fw-bold">{ubicacion.nombre}</h5>
            <p className="mb-1 text-muted">{ubicacion.direccion}</p>
            <p className="small text-muted">Coordenadas: {ubicacion.lat}, {ubicacion.lng}</p>
            <a href={ubicacion.googleMapsUrl} target="_blank" rel="noreferrer" className="btn btn-outline-primary mt-2">Abrir en Google Maps</a>
          </div>
        ) : (
          <div>Cargando configuración...</div>
        )}
      </div>
    </div>
  );
}

export default Config;
