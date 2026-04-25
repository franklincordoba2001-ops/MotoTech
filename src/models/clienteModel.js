// CAMBIO: Importación moderna con extensión .js
import db from '../config/db.js';

export const getAllClientes = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM clientes');
        return rows;
    } catch (error) {
        throw new Error('Error al obtener clientes: ' + error.message);
    }
};

export const getClienteById = async (id) => {
    try {
        const [rows] = await db.query('SELECT * FROM clientes WHERE id = ?', [id]);
        return rows[0]; 
    } catch (error) {
        throw new Error('Error al buscar el cliente: ' + error.message);
    }
};

export const createCliente = async (cliente) => {
    const { nombre, telefono, direccion, email } = cliente;

    if (!nombre || !telefono) {
        throw new Error('El nombre y el teléfono son obligatorios');
    }

    try {
        const sql = `
            INSERT INTO clientes (nombre, telefono, direccion, email)
            VALUES (?, ?, ?, ?)
        `;
        const values = [nombre, telefono, direccion, email];
        const [result] = await db.query(sql, values);
        return result;
    } catch (error) {
        throw new Error('Error al crear el cliente: ' + error.message);
    }
};

export const updateCliente = async (id, cliente) => {
    const { nombre, telefono, direccion, email } = cliente;

    try {
        const sql = `
            UPDATE clientes
            SET nombre = ?, telefono = ?, direccion = ?, email = ?
            WHERE id = ?
        `;
        const values = [nombre, telefono, direccion, email, id];
        const [result] = await db.query(sql, values);
        
        if (result.affectedRows === 0) {
            throw new Error('No se encontró el cliente para actualizar');
        }
        return result;
    } catch (error) {
        throw new Error('Error al actualizar el cliente: ' + error.message);
    }
};

export const deleteCliente = async (id) => {
    try {
        const [result] = await db.query('DELETE FROM clientes WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            throw new Error('El cliente no existe o ya fue eliminado');
        }
        return result;
    } catch (error) {
        throw new Error('Error al eliminar el cliente: ' + error.message);
    }
};

// YA NO se usa module.exports