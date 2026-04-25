// CAMBIO: Importación moderna con extensión .js
import db from '../config/db.js';

export const getAllFacturas = async () => {
  const [rows] = await db.query(`
    SELECT 
      f.id AS factura_id,
      f.fecha,
      f.total,
      f.metodo_pago,
      o.descripcion AS orden_descripcion,
      c.nombre AS cliente_nombre
    FROM facturas f
    JOIN ordenes_servicio o ON f.orden_id = o.id
    JOIN motos m ON o.moto_id = m.id
    JOIN clientes c ON m.cliente_id = c.id
    ORDER BY f.id DESC
  `);
  return rows;
};

export const getFacturaCompletaById = async (id) => {
  const [rows] = await db.query(`
    SELECT 
      f.id AS factura_id,
      f.fecha,
      f.total,
      f.metodo_pago,
      o.descripcion,
      m.placa,
      m.marca,
      m.modelo,
      c.nombre AS cliente_nombre,
      c.telefono
    FROM facturas f
    JOIN ordenes_servicio o ON f.orden_id = o.id
    JOIN motos m ON o.moto_id = m.id
    JOIN clientes c ON m.cliente_id = c.id
    WHERE f.id = ?
  `, [id]);
  return rows[0];
};

export const getFacturaById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM facturas WHERE id = ?',
    [id]
  );
  return rows[0];
};

export const createFactura = async (orden_id, fecha, total, metodo_pago) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Aseguramos que el total sea un número entero
    const totalLimpio = Math.floor(Number(total));

    const [result] = await connection.query(
      `INSERT INTO facturas (orden_id, fecha, total, metodo_pago)
       VALUES (?, ?, ?, ?)`,
      [orden_id, fecha, totalLimpio, metodo_pago]
    );

    // Actualizamos el estado de la orden
    await connection.query(
      `UPDATE ordenes_servicio 
       SET estado = 'entregado'
       WHERE id = ?`,
      [orden_id]
    );

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    console.error("Error en la transacción de factura:", error);
    throw error;
  } finally {
    connection.release();
  }
};

export const deleteFactura = async (id) => {
  const [result] = await db.query(
    'DELETE FROM facturas WHERE id = ?',
    [id]
  );
  return result;
};

// YA NO se usa module.exports