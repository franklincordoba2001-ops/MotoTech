/*const facturaModel = require('../models/facturaModel');
const PDFDocument = require('pdfkit');


const getFacturas = async (req, res) => {
  try {
    const facturas = await facturaModel.getAllFacturas();
    res.json(facturas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const factura = await facturaModel.getFacturaById(id);

    if (!factura) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }

    res.json(factura);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createFactura = async (req, res) => {
  try {
    const { orden_id, fecha, total, metodo_pago } = req.body;

    
    if (!orden_id || !fecha || !total) {
      return res.status(400).json({
        message: 'Campos obligatorios faltantes (orden_id, fecha o total)'
      });
    }

    
    const result = await facturaModel.createFactura(
      Number(orden_id),
      fecha,
      Number(total), 
      metodo_pago
    );

    res.status(201).json({
      message: 'Factura creada correctamente',
      id: result.insertId
    });

  } catch (error) {
    console.error("DETALLE DEL ERROR EN EL SERVIDOR:", error); 
    res.status(500).json({ error: error.message });
  }
};


const deleteFactura = async (req, res) => {
  try {
    const { id } = req.params;
    await facturaModel.deleteFactura(id);
    res.json({ message: 'Factura eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const generarFacturaPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const factura = await facturaModel.getFacturaCompletaById(id);

    if (!factura) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=factura_${factura.factura_id}.pdf`
    );

    doc.pipe(res);

   
    doc.fontSize(20).text("MOTO TECH - TALLER MECÁNICO", { align: 'center' });
    doc.fontSize(10).text("Servicio técnico especializado", { align: 'center' });
    doc.moveDown();
    doc.rect(50, 110, 500, 1).fill('#000000'); 
    doc.moveDown();

    doc.fontSize(14).text(`Factura de Venta: #${factura.factura_id}`, { underline: true });
    doc.fontSize(12).text(`Fecha de emisión: ${new Date(factura.fecha).toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(12).text("DATOS DEL CLIENTE", { fw: 'bold' });
    doc.text(`Nombre: ${factura.cliente_nombre}`);
    doc.text(`Teléfono: ${factura.telefono}`);
    doc.moveDown();

    doc.fontSize(12).text("DATOS DEL VEHÍCULO");
    doc.text(`Moto: ${factura.marca} ${factura.modelo}`);
    doc.text(`Placa: ${factura.placa}`);
    doc.moveDown();

    doc.fontSize(12).text("DETALLE DEL SERVICIO");
    doc.text(`Descripción: ${factura.descripcion}`);
    doc.moveDown();

    doc.rect(50, 400, 500, 40).fill('#f0f0f0');
    doc.fillColor('#000000');
    doc.fontSize(16).text(`TOTAL PAGADO: $${Number(factura.total).toLocaleString('es-CO')}`, 60, 412);
    doc.fontSize(11).text(`Método de pago: ${factura.metodo_pago}`, 350, 415);

    doc.end();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getFacturas,
  getFactura,
  createFactura,
  deleteFactura,
  generarFacturaPDF
};*/




import PDFDocument from 'pdfkit';
import reporteService from '../services/reporteService.js'; 

export const getFacturas = async (req, res) => {
    try {
        const facturas = await reporteService.listAll();
        res.json(facturas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener reportes" });
    }
};

export const crearFactura = async (req, res) => {
    try {
        const resultado = await reporteService.save(req.body);
        res.status(201).json({ mensaje: "Reporte guardado", id: resultado.insertId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const eliminarFactura = async (req, res) => {
    try {
        const { id } = req.params;
        await reporteService.delete(id);
        res.json({ message: "Reporte eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarFactura = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await reporteService.update(id, req.body);
        res.json({ mensaje: "Reporte actualizado", resultado });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const descargarFacturaPDF = async (req, res) => {
    const { id } = req.params;
    try {
        const factura = await reporteService.listById(id); 

        if (!factura) {
            return res.status(404).json({ message: "Factura no encontrada" });
        }

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Factura_${id}.pdf`);

        doc.pipe(res);

        
        doc.fontSize(20).text('MOTO TECH', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Factura N°: ${id}`);
        doc.text(`Orden de Servicio: #${factura.orden_id}`);
        doc.text(`Fecha: ${new Date(factura.fecha).toLocaleDateString()}`);
        
        doc.moveDown();
        
        doc.fontSize(14).text(`Método de Pago: ${factura.metodo_pago || 'No especificado'}`, { bold: true });
        
        doc.moveDown();
        doc.fontSize(16).text(`TOTAL: $${factura.total}`, { bold: true });

        doc.end();

    } catch (error) {
        res.status(500).json({ message: "Error al generar el PDF" });
    }
};