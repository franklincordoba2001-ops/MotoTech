import express from 'express';
const router = express.Router();


import {
  crearUsuario,     
  getUsuarios,
  eliminarUsuario,    
  actualizarUsuario   
} from "../controllers/usuarioController.js";


import verifyToken from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/roleMiddleware.js";


router.post("/", verifyToken, authorizeRole("admin"), crearUsuario);
router.get("/", verifyToken, authorizeRole("admin"), getUsuarios);
router.delete("/:id", verifyToken, authorizeRole("admin"), eliminarUsuario);
router.put("/:id", verifyToken, authorizeRole("admin"), actualizarUsuario);

export default router;