import * as clienteModel from '../models/clienteModel.js';

export const getClientes = async (req, res) => {
    try {
        const clientes = await clienteModel.getAllClientes();
        res.json(clientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

export const getCliente = async (req, res) => {
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

export const createCliente = async (req, res) => {
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

export const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const datosCliente = req.body;
        
        await clienteModel.updateCliente(id, datosCliente);
        
        res.json({ message: 'Cliente actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        await clienteModel.deleteCliente(id);
        
        res.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

