const express = require("express");
const router = express.Router();
const articulosControllers = require('../controllers/articulosControllers');

// Ruta para crear un nuevo artículo
router.post("/crearArticulo", articulosControllers.crearArticulo);

// Ruta para listar todos los artículos
router.get("/obtenerArticulos", articulosControllers.obtenerArticulos);

// Ruta para obtener un artículo por ID
router.get("/obtenerArticulo/:id", articulosControllers.obtenerArticuloPorId);

// Ruta para actualizar un artículo por ID
router.put("/actualizarArticulo/:id", articulosControllers.actualizarArticulo);

// Ruta para eliminar un artículo por ID
router.delete("/eliminarArticulo/:id", articulosControllers.eliminarArticulo);

module.exports = router;
