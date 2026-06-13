const API = "http://localhost:3000/api";


const handleResponse = async (res, defaultError) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || defaultError);
  }
  return res.json();
};


export const login = async (data) => {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Error al iniciar sesión");
};


export const getClientes = async (token) => {
  const res = await fetch(`${API}/clientes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res, "Error al obtener clientes");
};

export const createCliente = async (data, token) => {
  const res = await fetch(`${API}/clientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Error al crear cliente");
};

export const updateCliente = async (id, data, token) => {
  const res = await fetch(`${API}/clientes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Error al actualizar cliente");
};

export const deleteCliente = async (id, token) => {
  const res = await fetch(`${API}/clientes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res, "Error al eliminar cliente");
};


export const getOrdenes = async (token) => {
  const res = await fetch(`${API}/ordenes`, {
    method: "GET",
    headers: { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return handleResponse(res, "Error al obtener órdenes");
};

export const createOrden = async (data, token) => {
  const res = await fetch(`${API}/ordenes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Error al crear la orden");
};

export const updateOrden = async (id, data, token) => {
  if (!id) throw new Error("ID de orden no proporcionado");
  const res = await fetch(`${API}/ordenes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Error al actualizar la orden");
};

export const deleteOrden = async (id, token) => {
  if (!id) throw new Error("ID de orden no válido para eliminar");
  const res = await fetch(`${API}/ordenes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res, "No se pudo eliminar la orden");
};


export const getFacturas = async (token) => {
  const res = await fetch(`${API}/facturas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res, "Error al obtener facturas");
};

export const createFactura = async (data, token) => {
  const res = await fetch(`${API}/facturas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Error al crear factura");
};

export const deleteFactura = async (id, token) => {
  const res = await fetch(`${API}/facturas/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res, "Error al eliminar factura");
};


export const getUsuarios = async (token) => {
  const res = await fetch(`${API}/usuarios`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res, "Error al obtener usuarios");
};

export const createUsuario = async (data, token) => {
  const res = await fetch(`${API}/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Error al crear usuario");
};

export const deleteUsuario = async (id, token) => {
  const res = await fetch(`${API}/usuarios/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res, "Error al eliminar usuario");
};

export const updateUsuario = async (id, data, token) => {
  const res = await fetch(`${API}/usuarios/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Error al actualizar usuario");
};


export const getRoles = async (token) => {
  const res = await fetch(`${API}/roles`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res, "Error al obtener roles");
};

export const createRol = async (data, token) => {
  const res = await fetch(`${API}/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Error al crear rol");
};

export const updateRol = async (id, data, token) => {
  const res = await fetch(`${API}/roles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Error al actualizar rol");
};

export const deleteRol = async (id, token) => {
  const res = await fetch(`${API}/roles/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res, "Error al eliminar rol");
};



export const getMotos = async (token) => {
  const res = await fetch(`${API}/motos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res, "Error al obtener motos");
};

export const createMoto = async (data, token) => {
  const res = await fetch(`${API}/motos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Error al registrar la moto");
};

export const deleteMoto = async (id, token) => {
  const res = await fetch(`${API}/motos/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res, "Error al eliminar la moto");
};




export const updateMoto = async (id, data, token) => {
  const res = await fetch(`${API}/motos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Error al actualizar la moto");
}

export const descargarFacturaPDF = async (id, token) => {
  const res = await fetch(`${API}/facturas/${id}/pdf`, { 
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("No se pudo generar el PDF");

  
  const blob = await res.blob();
  return blob;
};


export const getUbicacionTaller = async () => {
  const res = await fetch(`${API}/config/ubicacion`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse(res, "Error al obtener ubicación del taller");
};


export const getRepuestos = async (token) => {
  const res = await fetch(`${API}/repuestos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res, "Error al obtener repuestos");
};

export const getOrdenRepuestos = async (ordenId, token) => {
  const res = await fetch(`${API}/repuestos/orden/${ordenId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res, "Error al obtener repuestos de la orden");
};

export const saveOrdenRepuestos = async (ordenId, repuestos, token) => {
  const res = await fetch(`${API}/repuestos/orden/${ordenId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ repuestos }),
  });
  return handleResponse(res, "Error al guardar repuestos en la orden");
};



