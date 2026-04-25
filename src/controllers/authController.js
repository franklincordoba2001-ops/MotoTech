import jwt from "jsonwebtoken";
import db from "../config/db.js"; 
import bcrypt from "bcrypt"; 

const SECRET_KEY = "secreto_super_seguro";

// Registrar usuarios (Admin/SuperAdmin)
export const register = async (req, res) => {
  const { nombre, email, password, role } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.query(
      "INSERT INTO usuarios (nombre, email, password, role) VALUES (?, ?, ?, ?)",
      [nombre, email, hashedPassword, role || 'usuario']
    );
    res.status(201).json({ message: "Usuario registrado con éxito y protegido" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login de usuarios
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
    
    // Devolvemos el nombre para que el Navbar pueda mostrarlo
    res.json({ 
      token,
      user: {
        id: user.id,
        nombre: user.nombre, // Ahora el frontend recibe el nombre
        email: user.email,
        role: user.role 
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Autoregistro para Clientes
export const autoregistro = async (req, res) => {
  const { nombre, email, password, telefono, direccion } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 1. Insertar en tabla usuarios
    const [userResult] = await db.query(
      "INSERT INTO usuarios (nombre, email, password, role) VALUES (?, ?, ?, ?)",
      [nombre, email, hashedPassword, 'cliente']
    );

    const nuevoIdUsuario = userResult.insertId;

    // 2. Insertar en tabla clientes usando el ID generado (cliente_id es la FK)
    await db.query(
      "INSERT INTO clientes (nombre, telefono, direccion, email, cliente_id) VALUES (?, ?, ?, ?, ?)",
      [nombre, telefono, direccion, email, nuevoIdUsuario]
    );

    res.status(201).json({ message: "¡Registro de cliente exitoso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};