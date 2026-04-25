// CAMBIO: Importación moderna con extensión .js
import db from "../config/db.js";

export const createUsuario = async (nombre, email, password, role) => {
  const [result] = await db.query(
    "INSERT INTO usuarios (nombre, email, password, role) VALUES (?, ?, ?, ?)",
    [nombre, email, password, role]
  );
  return result;
};

export const getUsuarios = async () => {
  const [rows] = await db.query("SELECT * FROM usuarios");
  return rows;
};

export const deleteUsuario = async (id) => {
  const [result] = await db.query(
    "DELETE FROM usuarios WHERE id = ?",
    [id]
  );
  return result;
};

export const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
  return rows[0]; 
};

// YA NO se usa module.exports