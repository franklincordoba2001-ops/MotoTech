import express from "express";
const router = express.Router();


import { getRoles, crearRol, eliminarRol, actualizarRol } from "../controllers/rolController.js";
import verifyToken from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/roleMiddleware.js";


router.get("/", verifyToken, authorizeRole("superadmin"), getRoles);
router.post("/", verifyToken, authorizeRole("superadmin"), crearRol);
router.delete("/:id", verifyToken, authorizeRole("superadmin"), eliminarRol);
router.put("/:id", verifyToken, authorizeRole("superadmin"), actualizarRol);

export default router;