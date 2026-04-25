import express from "express";
const router = express.Router();


import { getRoles, crearRol, eliminarRol, actualizarRol } from "../controllers/rolController.js";
import verifyToken from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/roleMiddleware.js";


router.get("/", verifyToken, authorizeRole("admin"), getRoles);
router.post("/", verifyToken, authorizeRole("admin"), crearRol);
router.delete("/:id", verifyToken, authorizeRole("admin"), eliminarRol);
router.put("/:id", verifyToken, authorizeRole("admin"), actualizarRol);

export default router;