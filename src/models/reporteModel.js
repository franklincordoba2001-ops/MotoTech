// CAMBIO: Importación moderna con extensión .js
import db from '../config/db.js';

export const getTotalGeneral = async () => {
  const [rows] = await db.query(`
    SELECT 
      IFNULL(SUM(total), 0) AS total_general,
      COUNT(*) AS cantidad_facturas
    FROM facturas
  `);
  return rows[0];
};

export const getTotalPorMetodoPago = async () => {
  const [rows] = await db.query(`
    SELECT 
      metodo_pago,
      SUM(total) AS total
    FROM facturas
    GROUP BY metodo_pago
  `);
  return rows;
};

export const getTotalPorFecha = async (inicio, fin) => {
  const [rows] = await db.query(`
    SELECT 
      IFNULL(SUM(total), 0) AS total_rango
    FROM facturas
    WHERE fecha BETWEEN ? AND ?
  `, [inicio, fin]);

  return rows[0];
};

// YA NO se usa module.exports