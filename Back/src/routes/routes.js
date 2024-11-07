const express = require('express');
const router = express.Router();
const usuariosRoutes = require('./usuariosRoutes');
const propiedadesRoutes = require('./propiedadesRoutes');
const articulosRoutes = require('./articulosRoutes');
// Usar las rutas de usuarios
router.use('/usuarios', usuariosRoutes);

// Usar las rutas de propiedades
router.use('/propiedades', propiedadesRoutes);

// Usar las rutas de artículos
router.use('/articulos', articulosRoutes);

module.exports = router;
