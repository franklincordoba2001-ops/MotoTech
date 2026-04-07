const userModel = require("../models/userModel");

const createUsuario = async (req, res) => {
  try {
    const { nombre, email, password, role } = req.body;

    const result = await userModel.createUsuario(
      nombre,
      email,
      password,
      role
    );

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getUsuarios = async (req, res) => {
  try {
    const data = await userModel.getUsuarios();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await userModel.deleteUsuario(id);

    // Verificamos si realmente se eliminó algo en la base de datos
    if (result.affectedRows > 0) {
      res.json({ 
        message: "Usuario eliminado correctamente",
        id: id 
      });
    } else {
      // Si el ID no existía
      res.status(404).json({ message: "No se encontró el usuario con ese ID" });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUsuario,
  getUsuarios,
  deleteUsuario,
};