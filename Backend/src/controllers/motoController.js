import * as motoModel from '../models/motoModel.js';


export const getMotos = async (req, res) => {
  try {
    let motos;
    if (req.user && req.user.role === 'cliente') {
      motos = await motoModel.getMotosByUsuarioId(req.user.id);
    } else {
      motos = await motoModel.getAllMotos();
    }
    res.json(motos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getMoto = async (req, res) => {
  try {
    const { id } = req.params;
    const moto = await motoModel.getMotoById(id);

    if (!moto) {
      return res.status(404).json({ message: 'Moto no encontrada' });
    }

    res.json(moto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


import * as clienteModel from '../models/clienteModel.js';
import db from '../config/db.js';

export const createMoto = async (req, res) => {
  try {
    let { placa, marca, modelo, cilindraje, cliente_id } = req.body;

    if (req.user && req.user.role === 'cliente') {
      let clienteDB = await clienteModel.getClienteByUsuarioId(req.user.id);
      if (!clienteDB) {
        // Auto-create client profile if missing
        const [userRows] = await db.query('SELECT nombre, email FROM usuarios WHERE id = ?', [req.user.id]);
        if (userRows && userRows.length > 0) {
          const user = userRows[0];
          const [insertResult] = await db.query(
            'INSERT INTO clientes (nombre, telefono, direccion, email, cliente_id) VALUES (?, ?, ?, ?, ?)',
            [user.nombre, 'Sin teléfono', 'Sin dirección', user.email, req.user.id]
          );
          clienteDB = { id: insertResult.insertId };
        } else {
          return res.status(400).json({ message: 'No se encontró tu perfil de usuario' });
        }
      }
      cliente_id = clienteDB.id;
    }

    const result = await motoModel.createMoto(
      placa,
      marca,
      modelo,
      cilindraje,
      cliente_id
    );

    res.status(201).json({
      message: 'Moto creada correctamente',
      id: result.insertId
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateMoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { placa, marca, modelo, cilindraje, cliente_id } = req.body;

    await motoModel.updateMoto(
      id,
      placa,
      marca,
      modelo,
      cilindraje,
      cliente_id
    );

    res.json({ message: 'Moto actualizada correctamente' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteMoto = async (req, res) => {
  try {
    const { id } = req.params;

    await motoModel.deleteMoto(id);

    res.json({ message: 'Moto eliminada correctamente' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

