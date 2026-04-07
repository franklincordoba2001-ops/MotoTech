const clienteModel = require('../models/clienteModel');

// Obtener todos los clientes
const getClientes = async (req, res) => {
    try {
        const clientes = await clienteModel.getAllClientes();
        res.json(clientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Obtener cliente por ID
const getCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await clienteModel.getClienteById(id);

        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear cliente
const createCliente = async (req, res) => {
    try {
        const datosCliente = req.body;
        const result = await clienteModel.createCliente(datosCliente);
        
        res.status(201).json({
            message: 'Cliente creado correctamente',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar cliente
const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const datosCliente = req.body;
        
        await clienteModel.updateCliente(id, datosCliente);
        
        res.json({ message: 'Cliente actualizado correctamente' });
    } catch (error) {
        // El error de "No se encontró el cliente" vendrá del modelo
        res.status(500).json({ error: error.message });
    }
};

// Eliminar cliente
const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        await clienteModel.deleteCliente(id);
        
        res.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getClientes,
    getCliente,
    createCliente,
    updateCliente,
    deleteCliente
};