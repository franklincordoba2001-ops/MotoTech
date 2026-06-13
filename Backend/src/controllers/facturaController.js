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
import * as facturaModel from '../models/facturaModel.js';
import pdfMicroservice from '../services/pdfMicroservice.js';
import { getRepuestosByOrdenId } from '../models/repuestoModel.js';

export const getFacturas = async (req, res) => {
    try {
        let facturas;
        if (req.user && req.user.role === 'cliente') {
            facturas = await facturaModel.getFacturasByUsuarioId(req.user.id);
        } else {
            facturas = await facturaModel.getAllFacturas();
        }
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
        
        
        if (req.user.role !== 'superadmin') {
            return res.status(403).json({ message: "Solo el superadmin puede eliminar facturas" });
        }
        
        await reporteService.delete(id);
        res.json({ message: "Factura marcada como eliminada correctamente (soft delete)" });
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
        const factura = await facturaModel.getFacturaCompletaById(id); 

        if (!factura) {
            return res.status(404).json({ message: "Factura no encontrada" });
        }

        // Obtener repuestos asignados a la orden
        const repuestos = await getRepuestosByOrdenId(factura.orden_id);

        try {
            console.log('Intentando generar PDF mediante microservicio...');
            const pdfBuffer = await pdfMicroservice.generarFacturaPDF({
                factura_id: factura.factura_id,
                fecha: new Date(factura.fecha).toLocaleDateString(),
                total: factura.total,
                metodo_pago: factura.metodo_pago || 'efectivo',
                cliente_nombre: factura.cliente_nombre || 'N/A',
                cliente_telefono: factura.telefono || 'N/A',
                moto_marca: factura.marca || 'N/A',
                moto_modelo: factura.modelo || '',
                moto_placa: factura.placa || 'N/A',
                descripcion: factura.descripcion || 'Servicio técnico general.',
                repuestos: repuestos || []
            });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=Factura_${id}.pdf`);
            res.send(pdfBuffer);
            console.log('PDF generado exitosamente por microservicio');
            return;

        } catch (microserviceError) {
            console.warn('Microservicio PDF no disponible, usando fallback PDFKit:', microserviceError.message);
            
            // Fallback a PDFKit si el microservicio falla
            const doc = new PDFDocument({ margin: 50 });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=Factura_${id}.pdf`);

            doc.pipe(res);

            doc.fillColor('#000000');
            doc.font('Helvetica-Bold').fontSize(20).text("MOTO TECH - TALLER MECÁNICO", { align: 'center' });
            doc.font('Helvetica').fontSize(10).text("Servicio técnico especializado", { align: 'center' });
            doc.moveDown();
            
            doc.rect(50, 110, 500, 1).fill('#000000'); 
            doc.moveDown(1.5);

            doc.fillColor('#000000');
            doc.font('Helvetica-Bold').fontSize(14).text(`Factura de Venta: #${factura.factura_id}`, 50, 130, { underline: true });
            doc.font('Helvetica').fontSize(12).text(`Fecha de emisión: ${new Date(factura.fecha).toLocaleDateString()}`);
            doc.moveDown();

            doc.font('Helvetica-Bold').fontSize(12).text("DATOS DEL CLIENTE");
            doc.font('Helvetica').fontSize(12).text(`Nombre: ${factura.cliente_nombre || 'N/A'}`);
            doc.fontSize(12).text(`Teléfono: ${factura.telefono || 'N/A'}`);
            doc.moveDown();

            doc.font('Helvetica-Bold').fontSize(12).text("DATOS DEL VEHÍCULO");
            doc.font('Helvetica').fontSize(12).text(`Moto: ${factura.marca || 'N/A'} ${factura.modelo || ''}`);
            doc.fontSize(12).text(`Placa: ${factura.placa ? factura.placa.toUpperCase() : 'N/A'}`);
            doc.moveDown();

            doc.font('Helvetica-Bold').fontSize(12).text("DETALLE DEL SERVICIO");
            doc.font('Helvetica').fontSize(12).text(`Descripción: ${factura.descripcion || 'Servicio técnico general.'}`);
            doc.moveDown();

            // Sección de repuestos en el PDF fallback
            if (repuestos && repuestos.length > 0) {
                doc.font('Helvetica-Bold').fontSize(12).text("REPUESTOS UTILIZADOS");
                doc.moveDown(0.5);
                repuestos.forEach((rep) => {
                    const subtotal = rep.cantidad * rep.precio_unitario;
                    doc.font('Helvetica').fontSize(11).text(
                        `- ${rep.nombre} x${rep.cantidad}: $${Number(rep.precio_unitario).toLocaleString('es-CO')} c/u (Subtotal: $${Number(subtotal).toLocaleString('es-CO')})`
                    );
                });
                doc.moveDown();
            }

            // Recuadro del total relativo al cursor actual
            const currentY = doc.y + 10;
            doc.rect(50, currentY, 500, 40).fill('#f0f0f0');
            
            doc.fillColor('#000000');
            const totalFormateado = Number(factura.total).toLocaleString('es-CO', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
            
            doc.font('Helvetica-Bold').fontSize(16).text(`TOTAL PAGADO: $${totalFormateado}`, 60, currentY + 12);
            
            const metodoPagoTexto = factura.metodo_pago ? factura.metodo_pago.toLowerCase() : 'efectivo';
            doc.font('Helvetica').fontSize(11).text(`Método de pago: ${metodoPagoTexto}`, 350, currentY + 4);

            doc.end();
        }

    } catch (error) {
        console.error("Error al descargar factura PDF:", error);
        res.status(500).json({ message: "Error al generar el PDF" });
    }
};