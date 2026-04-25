// CAMBIO: Importación moderna con extensión .js
import db from '../config/db.js';

export const getAllMotos = async () => {
  const [rows] = await db.query('SELECT * FROM motos');
  return rows;
};

export const getMotoById = async (id) => {
  const [rows] = await db.query('SELECT * FROM motos WHERE id = ?', [id]);
  return rows[0];
};

export const createMoto = async (placa, marca, modelo, cilindraje, cliente_id) => {
  const [result] = await db.query(
    'INSERT INTO motos (placa, marca, modelo, cilindraje, cliente_id) VALUES (?, ?, ?, ?, ?)',
    [placa, marca, modelo, cilindraje, cliente_id]
  );
  return result;
};

export const updateMoto = async (id, placa, marca, modelo, cilindraje, cliente_id) => {
  const [result] = await db.query(
    'UPDATE motos SET placa=?, marca=?, modelo=?, cilindraje=?, cliente_id=? WHERE id=?',
    [placa, marca, modelo, cilindraje, cliente_id, id]
  );
  return result;
};

export const deleteMoto = async (id) => {
  const [result] = await db.query(
    'DELETE FROM motos WHERE id = ?',
    [id]
  );
  return result;
};

// YA NO se usa module.exports