import * as ordenModel from '../models/ordenModel.js';


export const getOrdenes = async (req, res) => {
  try {
    const ordenes = await ordenModel.getAllOrdenes();
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const orden = await ordenModel.getOrdenById(id);

    if (!orden) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    res.json(orden);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createOrden = async (req, res) => {
  try {
    const {
      moto_id,
      descripcion,
      fecha_ingreso,
      fecha_entrega,
      estado,
      costo,
    } = req.body;

    const result = await ordenModel.createOrden(
      moto_id,
      descripcion,
      fecha_ingreso,
      fecha_entrega,
      estado,
      Number(costo)
    );

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const { moto_id, descripcion, fecha_ingreso, fecha_entrega, estado, costo } = req.body;

    await ordenModel.updateOrden(
      id,
      moto_id,
      descripcion,
      fecha_ingreso,
      fecha_entrega,
      estado,
      Number(costo)
    );

    res.json({ message: 'Orden actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrden = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ordenModel.deleteOrden(id);

    if (result.affectedRows > 0) {
      res.json({ message: "Orden eliminada correctamente" });
    } else {
      res.status(404).json({ message: "No se encontró la orden" });
    }
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ 
        error: "No se puede eliminar la orden porque tiene una factura asociada. Elimina primero la factura." 
      });
    }
    res.status(500).json({ error: error.message });
  }
};

