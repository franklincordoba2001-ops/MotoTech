const jwt = require("jsonwebtoken");
const db = require("../config/db");

const SECRET_KEY = "secreto_super_seguro";

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];

   
    if (password !== user.password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { login };