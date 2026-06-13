import * as reporteModel from '../models/reporteModel.js';
import reporteService from '../services/reporteService.js';

export const totalGeneral = async (req, res) => {
  try {
    const data = await reporteModel.getTotalGeneral();
    res.json({
      success: true,
      data: data,
      message: "Total general obtenido"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const totalPorMetodoPago = async (req, res) => {
  try {
    const data = await reporteModel.getTotalPorMetodoPago();
    res.json({
      success: true,
      data: data,
      message: "Total por método de pago obtenido"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const totalPorFecha = async (req, res) => {
  try {
    const { inicio, fin } = req.query;

    if (!inicio || !fin) {
      return res.status(400).json({
        success: false,
        message: "Debe enviar fecha inicio y fin"
      });
    }

    const data = await reporteModel.getTotalPorFecha(inicio, fin);
    res.json({
      success: true,
      data: data,
      message: "Total por fecha obtenido"
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

/**
 * SUPERADMIN: Obtiene reporte financiero completo
 */
export const obtenerReportFinanciero = async (req, res) => {
  try {
    const data = await reporteService.obtenerReportFinanciero();
    res.json({
      success: true,
      data: data,
      message: "Reporte financiero obtenido"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * SUPERADMIN: Obtiene ganancias por mes
 */
export const obtenerGananciasPorMes = async (req, res) => {
  try {
    const { año } = req.query;
    const data = await reporteService.obtenerGananciasPorMes(año || null);
    
    res.json({
      success: true,
      data: data,
      message: "Ganancias por mes obtenidas"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * SUPERADMIN: Obtiene ganancias por día
 */
export const obtenerGananciasPorDia = async (req, res) => {
  try {
    const { inicio, fin } = req.query;

    if (!inicio || !fin) {
      return res.status(400).json({
        success: false,
        message: "Debe proporcionar fechas de inicio y fin"
      });
    }

    const data = await reporteService.obtenerGananciasPorDia(inicio, fin);
    res.json({
      success: true,
      data: data,
      message: "Ganancias por día obtenidas"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * SUPERADMIN: Obtiene estadísticas completas del taller
 */
export const obtenerEstadisticasCompletas = async (req, res) => {
  try {
    const data = await reporteService.obtenerEstadisticasCompletas();
    res.json({
      success: true,
      data: data,
      message: "Estadísticas completas del taller obtenidas"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

