const express = require('express');
const router = express.Router();
const usuarioRoute = require('./usuarioRoute');
const propiedadRoute = require('./propiedadRoute');
const articuloRoute = require('./articuloRoute');
const imagenRoute = require('./imagenRoute');

// Usar las rutas de usuarios
router.use('/usuarios', usuarioRoute);

// Usar las rutas de propiedades
router.use('/propiedades', propiedadRoute);

// Usar las rutas de artículos
router.use('/articulos', articuloRoute);


router.use('/imagenes', imagenRoute);

module.exports = router;
