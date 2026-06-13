import * as repuestoModel from '../models/repuestoModel.js';
import * as ordenModel from '../models/ordenModel.js';
import db from '../config/db.js';

export const getRepuestos = async (req, res) => {
  try {
    const repuestos = await repuestoModel.getAllRepuestos();
    res.json(repuestos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrdenRepuestos = async (req, res) => {
  try {
    const { ordenId } = req.params;
    const repuestos = await repuestoModel.getRepuestosByOrdenId(ordenId);
    res.json(repuestos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const saveOrdenRepuestos = async (req, res) => {
  const { ordenId } = req.params;
  const { repuestos } = req.body; // Array de { repuesto_id, cantidad, precio_unitario }

  try {
    // Usamos una transacción para garantizar consistencia
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Obtener repuestos previos para revertir stock (opcional pero profesional)
      const repuestosPrevios = await repuestoModel.getRepuestosByOrdenId(ordenId);
      for (const prev of repuestosPrevios) {
        await connection.query(
          'UPDATE repuestos SET stock = stock + ? WHERE id = ?',
          [prev.cantidad, prev.repuesto_id]
        );
      }

      // 2. Limpiar asociaciones previas
      await connection.query('DELETE FROM orden_repuestos WHERE orden_id = ?', [ordenId]);

      // 3. Insertar nuevos repuestos y restar del stock
      let costoRepuestos = 0;
      if (repuestos && Array.isArray(repuestos)) {
        for (const item of repuestos) {
          const { repuesto_id, cantidad, precio_unitario } = item;
          
          await connection.query(
            `INSERT INTO orden_repuestos (orden_id, repuesto_id, cantidad, precio_historico) 
             VALUES (?, ?, ?, ?)`,
            [ordenId, repuesto_id, cantidad, precio_unitario]
          );

          await connection.query(
            'UPDATE repuestos SET stock = stock - ? WHERE id = ?',
            [cantidad, repuesto_id]
          );

          costoRepuestos += cantidad * precio_unitario;
        }
      }

      // 4. Actualizar el costo acumulado en la orden (costo_mano_obra + costoRepuestos)
      // Primero leemos la orden para saber su costo actual o si tiene mano de obra asignada.
      // Si el campo costo_mano_obra no existe en ordenes_servicio, usamos el campo costo para el total.
      const [ordenRows] = await connection.query('SELECT * FROM ordenes_servicio WHERE id = ?', [ordenId]);
      if (ordenRows.length > 0) {
        const orden = ordenRows[0];
        // Si no separamos mano de obra, podemos simplemente asumir que el 'costo' de la orden se incrementa
        // o se sobreescribe con el costo de los repuestos + mano de obra.
        const manoDeObra = orden.costo_mano_obra || 0; 
        const nuevoCostoTotal = Number(manoDeObra) + costoRepuestos;

        await connection.query(
          'UPDATE ordenes_servicio SET costo = ? WHERE id = ?',
          [nuevoCostoTotal, ordenId]
        );
      }

      await connection.commit();
      connection.release();

      res.json({ message: 'Repuestos de la orden actualizados correctamente' });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
