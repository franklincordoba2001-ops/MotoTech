import express from 'express';
import { register, login, autoregistro } from "../controllers/authController.js";

const router = express.Router();


router.post('/register', register);    
router.post('/login', login);           
router.post("/autoregistro", autoregistro); 

export default router;