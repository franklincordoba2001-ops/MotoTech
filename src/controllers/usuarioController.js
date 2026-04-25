/*const userModel = require("../models/userModel");
const bcrypt = require("bcrypt"); 

const createUsuario = async (req, res) => {
  try {
    const { nombre, email, password, role } = req.body;

   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

   
    const result = await userModel.createUsuario(
      nombre,
      email,
      hashedPassword, 
      role
    );

    res.json({
      message: "Usuario creado correctamente",
      result
    });
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

    if (result.affectedRows > 0) {
      res.json({ 
        message: "Usuario eliminado correctamente",
        id: id 
      });
    } else {
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
};*/
// CAMBIO: Importación moderna con .js
import usuarioService from '../services/usuarioService.js'; 


export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.listAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
};

export const crearUsuario = async (req, res) => {
    try {
        const resultado = await usuarioService.save(req.body);
        res.status(201).json({ mensaje: "Usuario creado con éxito", id: resultado.insertId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await usuarioService.delete(id);
        if (resultado.affectedRows > 0) {
            res.json({ mensaje: "Usuario eliminado con éxito", id: id });
        } else {
            res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
};

export const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await usuarioService.update(id, req.body);
        if (resultado.affectedRows > 0) {
            res.json({ mensaje: "Usuario actualizado con éxito", id: id });
        } else {
            res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar usuario" });
    }
};

