import React from 'react';

const UbicacionTaller = () => {

  const direccion = "Mocoa, Putumayo"; 
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=TU_API_KEY_AQUI&q=${encodeURIComponent(direccion)}`;

  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden mt-4">
      <div className="card-body p-0">
        <div className="p-3">
          <h5 className="fw-bold text-dark mb-1">
            <i className="bi bi-geo-alt-fill text-danger me-2"></i>
            Nuestra Ubicación
          </h5>
          <p className="text-muted small mb-0">Encuéntranos en Mocoa, Putumayo</p>
        </div>
        <div style={{ height: "300px", width: "100%" }}>
          <iframe
            title="Mapa del taller"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            src={mapUrl}
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default UbicacionTaller;