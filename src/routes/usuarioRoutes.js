const express = require("express");
const router = express.Router();


const {
  createUsuario,
  getUsuarios,
  deleteUsuario, 
} = require("../controllers/usuarioController");

router.post("/", createUsuario);
router.get("/", getUsuarios);
router.delete("/:id", deleteUsuario);

module.exports = router;