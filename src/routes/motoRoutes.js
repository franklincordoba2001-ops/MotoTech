import express from 'express';
const router = express.Router();


import * as motoController from '../controllers/motoController.js';

router.get('/', motoController.getMotos);
router.get('/:id', motoController.getMoto);
router.post('/', motoController.createMoto);
router.put('/:id', motoController.updateMoto);
router.delete('/:id', motoController.deleteMoto);


export default router;