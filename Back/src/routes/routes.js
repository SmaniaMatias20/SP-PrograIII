const express = require('express');
const router = express.Router();
const usuarioRoute = require('./usuarioRoute');
const propiedadRoute = require('./propiedadRoute');
const articuloRoute = require('./articuloRoute');
const imagenRoute = require('./imagenRoute');
const comprobanteRoute = require('./comprobanteRoute');

// Usar las rutas de usuarios
router.use('/usuarios', usuarioRoute);

// Usar las rutas de propiedades
router.use('/propiedades', propiedadRoute);

// Usar las rutas de artículos
router.use('/articulos', articuloRoute);

// Usar las rutas de imágenes
router.use('/imagenes', imagenRoute);

// Usar las rutas de comprobantes
router.use('/comprobantes', comprobanteRoute);

module.exports = router;
