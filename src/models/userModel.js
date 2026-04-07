const db = require("../config/db");

const createUsuario = async (nombre, email, password, role) => {
  const [result] = await db.query(
    "INSERT INTO usuarios (nombre, email, password, role) VALUES (?, ?, ?, ?)",
    [nombre, email, password, role]
  );
  return result;
};

const getUsuarios = async () => {
  const [rows] = await db.query("SELECT * FROM usuarios");
  return rows;
};

const deleteUsuario = async (id) => {
  const [result] = await db.query(
    "DELETE FROM usuarios WHERE id = ?",
    [id]
  );
  return result;
};

// --- AGREGA ESTA FUNCIÓN ---
const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
  return rows[0]; // Retorna el primer usuario encontrado o undefined
};

module.exports = {
  createUsuario,
  getUsuarios,
  findUserByEmail,
  deleteUsuario,
  
};