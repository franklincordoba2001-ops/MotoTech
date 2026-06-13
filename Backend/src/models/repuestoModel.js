import db from '../config/db.js';

// Obtener catálogo de repuestos
export const getAllRepuestos = async () => {
  const [rows] = await db.query('SELECT * FROM repuestos ORDER BY nombre ASC');
  return rows;
};

// Obtener repuestos de una orden de servicio específica
export const getRepuestosByOrdenId = async (ordenId) => {
  const [rows] = await db.query(
    `SELECT 
      CONCAT(or_rep.orden_id, '-', or_rep.repuesto_id) AS association_id,
      r.id AS repuesto_id,
      r.nombre,
      or_rep.cantidad,
      or_rep.precio_historico AS precio_unitario,
      (or_rep.cantidad * or_rep.precio_historico) AS subtotal
    FROM orden_repuestos or_rep
    JOIN repuestos r ON or_rep.repuesto_id = r.id
    WHERE or_rep.orden_id = ?`,
    [ordenId]
  );
  return rows;
};

// Agregar repuesto a una orden
export const addRepuestoToOrden = async (ordenId, repuestoId, cantidad, precioUnitario) => {
  const [result] = await db.query(
    `INSERT INTO orden_repuestos (orden_id, repuesto_id, cantidad, precio_historico) 
     VALUES (?, ?, ?, ?)`,
    [ordenId, repuestoId, cantidad, precioUnitario]
  );
  return result;
};

// Limpiar todos los repuestos asociados a una orden (para cuando se re-guardan)
export const clearRepuestosFromOrden = async (ordenId) => {
  const [result] = await db.query(
    'DELETE FROM orden_repuestos WHERE orden_id = ?',
    [ordenId]
  );
  return result;
};

// Actualizar stock de un repuesto (restar o sumar)
export const updateRepuestoStock = async (repuestoId, cantidadCambio) => {
  const [result] = await db.query(
    'UPDATE repuestos SET stock = stock + ? WHERE id = ?',
    [cantidadCambio, repuestoId]
  );
  return result;
};
