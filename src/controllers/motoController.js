import * as motoModel from '../models/motoModel.js';


export const getMotos = async (req, res) => {
  try {
    const motos = await motoModel.getAllMotos();
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


export const createMoto = async (req, res) => {
  try {
    const { placa, marca, modelo, cilindraje, cliente_id } = req.body;

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

