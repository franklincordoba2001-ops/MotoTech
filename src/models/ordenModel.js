const db = require('../config/db');

// Obtener todas las órdenes con datos de moto y cliente
const getAllOrdenes = async () => {
  const [rows] = await db.query(`
    SELECT 
      o.id AS id, 
      o.descripcion,
      o.fecha_ingreso,
      o.fecha_entrega,
      o.estado,
      o.costo,
      m.id AS moto_id,
      m.placa,
      m.marca,
      m.modelo,
      c.id AS cliente_id,
      c.nombre,
      c.telefono
    FROM ordenes_servicio o
    JOIN motos m ON o.moto_id = m.id
    JOIN clientes c ON m.cliente_id = c.id
  `); 

  return rows;
};

// Obtener orden por ID
const getOrdenById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM ordenes_servicio WHERE id = ?',
    [id]
  );
  return rows[0];
};

// Crear orden
const createOrden = async (
  moto_id,
  descripcion,
  fecha_ingreso,
  fecha_entrega,
  estado,
  costo
) => {
  const [result] = await db.query(
    `INSERT INTO ordenes_servicio 
    (moto_id, descripcion, fecha_ingreso, fecha_entrega, estado, costo) 
    VALUES (?, ?, ?, ?, ?, ?)`,
    [moto_id, descripcion, fecha_ingreso, fecha_entrega, estado, costo]
  );

  return result;
};

// Actualizar orden
const updateOrden = async (id, moto_id, descripcion, fecha_ingreso, fecha_entrega, estado, costo) => {
  const costoLimpio = Math.round(costo || 0);
  
  const [result] = await db.query(
    `UPDATE ordenes_servicio 
     SET moto_id=?, descripcion=?, fecha_ingreso=?, fecha_entrega=?, estado=?, costo=? 
     WHERE id=?`,
    [moto_id, descripcion, fecha_ingreso, fecha_entrega, estado, costoLimpio, id]
  );
  return result;
};

const deleteOrden = async (id) => {
  
  const [result] = await db.query("DELETE FROM ordenes_servicio WHERE id = ?", [id]);
  return result;
};


module.exports = {
  getAllOrdenes,
  getOrdenById,
  createOrden,
  updateOrden,
  deleteOrden
};