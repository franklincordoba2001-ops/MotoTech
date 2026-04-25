import rolService from '../services/rolService.js';

export const getRoles = async (req, res) => {
    try {
        const roles = await rolService.listAll();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener roles" });
    }
};

export const crearRol = async (req, res) => {
    try {
        const resultado = await rolService.save(req.body);
        res.status(201).json({ mensaje: "Rol creado con éxito", id: resultado.insertId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const eliminarRol = async (req, res) => {
    try {
        await rolService.delete(req.params.id);
        res.json({ mensaje: "Rol eliminado" });
    } catch (error) {
       
        res.status(400).json({ error: error.message });
    }
};

export const actualizarRol = async (req, res) => {
    try {
        await rolService.update(req.params.id, req.body);
        res.json({ mensaje: "Rol actualizado" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

