const express = require('express');
const router = express.Router();
const imagenesController = require('../controllers/imagenArticuloController');

// Ruta para obtener todas las imágenes de una propiedad
router.get('/articulo/:id_articulo', imagenesController.obtenerImagenesPorArticulo);

module.exports = router;
