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
import usuarioService from '../services/usuarioService.js'; 


export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.listAll();
        res.json({
            success: true,
            data: usuarios,
            message: "Usuarios obtenidos"
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: "Error al obtener usuarios" 
        });
    }
};

export const crearUsuario = async (req, res) => {
    try {
        const resultado = await usuarioService.save(req.body);
        res.status(201).json({ 
            success: true,
            mensaje: "Usuario creado con éxito", 
            id: resultado.insertId 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
};

export const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await usuarioService.delete(id);
        if (resultado.affectedRows > 0) {
            res.json({ 
                success: true,
                mensaje: "Usuario eliminado con éxito", 
                id: id 
            });
        } else {
            res.status(404).json({ 
                success: false,
                mensaje: "Usuario no encontrado" 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: "Error al eliminar usuario" 
        });
    }
};

export const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await usuarioService.update(id, req.body);
        if (resultado.affectedRows > 0) {
            res.json({ 
                success: true,
                mensaje: "Usuario actualizado con éxito", 
                id: id 
            });
        } else {
            res.status(404).json({ 
                success: false,
                mensaje: "Usuario no encontrado" 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: "Error al actualizar usuario" 
        });
    }
};

/**
 * SUPERADMIN ONLY: Asigna un rol a un usuario
 */
export const asignarRol = async (req, res) => {
    try {
        const { usuarioId, nuevoRol } = req.body;

        if (!usuarioId || !nuevoRol) {
            return res.status(400).json({
                success: false,
                message: "Debe proporcionar usuarioId y nuevoRol"
            });
        }

        await usuarioService.asignarRol(usuarioId, nuevoRol);

        res.json({
            success: true,
            message: `Rol '${nuevoRol}' asignado exitosamente al usuario`,
            data: { usuarioId, nuevoRol }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * SUPERADMIN ONLY: Obtiene estadísticas de usuarios
 */
export const obtenerEstadisticas = async (req, res) => {
    try {
        const estadisticas = await usuarioService.obtenerEstadisticas();

        res.json({
            success: true,
            data: estadisticas,
            message: "Estadísticas de usuarios obtenidas"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * SUPERADMIN ONLY: Obtiene usuarios por rol
 */
export const obtenerPorRol = async (req, res) => {
    try {
        const { role } = req.params;
        const usuarios = await usuarioService.obtenerPorRol(role);

        res.json({
            success: true,
            data: usuarios,
            message: `Usuarios con rol '${role}' obtenidos`,
            cantidad: usuarios.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * SUPERADMIN ONLY: Desactiva un usuario
 */
export const desactivarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await usuarioService.desactivarUsuario(id);

        res.json({
            success: true,
            message: "Usuario desactivado exitosamente",
            data: { usuarioId: id, estado: 'desactivado' }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * SUPERADMIN ONLY: Activa un usuario
 */
export const activarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await usuarioService.activarUsuario(id);

        res.json({
            success: true,
            message: "Usuario activado exitosamente",
            data: { usuarioId: id, estado: 'activo' }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

