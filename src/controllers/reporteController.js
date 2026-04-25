import * as reporteModel from '../models/reporteModel.js';

export const totalGeneral = async (req, res) => {
  try {
    const data = await reporteModel.getTotalGeneral();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const totalPorMetodoPago = async (req, res) => {
  try {
    const data = await reporteModel.getTotalPorMetodoPago();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const totalPorFecha = async (req, res) => {
  try {
    const { inicio, fin } = req.query;

    if (!inicio || !fin) {
      return res.status(400).json({
        message: "Debe enviar fecha inicio y fin"
      });
    }

    const data = await reporteModel.getTotalPorFecha(inicio, fin);
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

