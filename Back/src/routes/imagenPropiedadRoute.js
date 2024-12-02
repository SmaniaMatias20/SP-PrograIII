const express = require('express');
const router = express.Router();
const imagenesController = require('../controllers/imagenPropiedadController');

// Ruta para obtener todas las imágenes de una propiedad
router.get('/propiedad/:id_propiedad', imagenesController.obtenerImagenesPorPropiedad);

module.exports = router;
