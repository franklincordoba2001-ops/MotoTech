import express from 'express';
import { getUbicacionTaller } from '../controllers/configController.js'; 

const router = express.Router();

router.get('/ubicacion', getUbicacionTaller);

export default router;