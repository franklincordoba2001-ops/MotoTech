/*const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');
const verifyToken = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');


// Obtener todas
router.get('/', verifyToken, facturaController.getFacturas);

// Obtener por ID
router.get('/:id', verifyToken, facturaController.getFactura);

// Crear factura
router.post('/', verifyToken, facturaController.createFactura);

// Eliminar (SOLO ADMIN)
router.delete(
  '/:id',
  verifyToken,
  authorizeRole('admin'),
  facturaController.deleteFactura
);

// Generar PDF
router.get('/:id/pdf', verifyToken, facturaController.generarFacturaPDF);

module.exports = router;*/



import express from 'express';
const router = express.Router();

import {
  getFacturas,
  crearFactura,
  eliminarFactura,
  actualizarFactura,
  descargarFacturaPDF 
} from "../controllers/facturaController.js";

import verifyToken from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/roleMiddleware.js";

router.get("/", verifyToken, authorizeRole("superadmin", "admin", "cliente"), getFacturas);
router.post("/", verifyToken, authorizeRole("superadmin", "admin"), crearFactura);
router.get("/:id/pdf", verifyToken, authorizeRole("superadmin", "admin", "cliente"), descargarFacturaPDF); 
router.put("/:id", verifyToken, authorizeRole("superadmin", "admin"), actualizarFactura);
router.delete("/:id", verifyToken, authorizeRole("superadmin"), eliminarFactura);

export default router;
