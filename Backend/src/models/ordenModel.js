
import db from '../config/db.js';

export const getAllOrdenes = async () => {
  const [rows] = await db.query(`
    SELECT 
      o.id AS id, 
      o.descripcion,
      o.fecha_ingreso,
      o.fecha_entrega,
      o.estado,
      o.costo,
      o.latitud,
      o.longitud,
      m.id AS moto_id,
      m.placa,
      m.marca,
      m.modelo,
      c.id AS cliente_id,
      c.nombre,
      c.telefono,
      (
        SELECT GROUP_CONCAT(CONCAT(r.nombre, ' (x', or_rep.cantidad, ')') SEPARATOR ', ')
        FROM orden_repuestos or_rep
        JOIN repuestos r ON or_rep.repuesto_id = r.id
        WHERE or_rep.orden_id = o.id
      ) AS repuestos_detalle
    FROM ordenes_servicio o
    JOIN motos m ON o.moto_id = m.id
    JOIN clientes c ON m.cliente_id = c.id
  `); 

  return rows;
};


export const getOrdenesByUsuarioId = async (usuarioId) => {
  const [rows] = await db.query(`
    SELECT 
      o.id AS id, 
      o.descripcion,
      o.fecha_ingreso,
      o.fecha_entrega,
      o.estado,
      o.costo,
      o.latitud,
      o.longitud,
      m.id AS moto_id,
      m.placa,
      m.marca,
      m.modelo,
      c.id AS cliente_id,
      c.nombre,
      c.telefono,
      (
        SELECT GROUP_CONCAT(CONCAT(r.nombre, ' (x', or_rep.cantidad, ')') SEPARATOR ', ')
        FROM orden_repuestos or_rep
        JOIN repuestos r ON or_rep.repuesto_id = r.id
        WHERE or_rep.orden_id = o.id
      ) AS repuestos_detalle
    FROM ordenes_servicio o
    JOIN motos m ON o.moto_id = m.id
    JOIN clientes c ON m.cliente_id = c.id
    WHERE c.cliente_id = ?
  `, [usuarioId]); 

  return rows;
};


export const getOrdenById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM ordenes_servicio WHERE id = ?',
    [id]
  );
  return rows[0];
};

export const createOrden = async (
  moto_id,
  descripcion,
  fecha_ingreso,
  fecha_entrega,
  estado,
  costo,
  latitud,
  longitud
) => {
  const [result] = await db.query(
    `INSERT INTO ordenes_servicio 
    (moto_id, descripcion, fecha_ingreso, fecha_entrega, estado, costo, latitud, longitud) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [moto_id, descripcion, fecha_ingreso, fecha_entrega, estado, costo, latitud, longitud]
  );

  return result;
};

export const updateOrden = async (id, moto_id, descripcion, fecha_ingreso, fecha_entrega, estado, costo, latitud, longitud) => {
  const costoLimpio = Math.round(costo || 0);
  
  const [result] = await db.query(
    `UPDATE ordenes_servicio 
     SET moto_id=?, descripcion=?, fecha_ingreso=?, fecha_entrega=?, estado=?, costo=?, latitud=?, longitud=? 
     WHERE id=?`,
    [moto_id, descripcion, fecha_ingreso, fecha_entrega, estado, costoLimpio, latitud, longitud, id]
  );
  return result;
};

export const deleteOrden = async (id) => {
  const [result] = await db.query("DELETE FROM ordenes_servicio WHERE id = ?", [id]);
  return result;
};

