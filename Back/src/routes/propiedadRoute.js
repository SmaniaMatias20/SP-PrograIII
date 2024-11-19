const express = require("express");
const router = express.Router();
const propiedadesControllers = require('../controllers/propiedadController');
const { verificarToken, tokenAdmin } = require('../middlewares/authMiddleware');

// Ruta para crear una nueva propiedad
router.post("/crearPropiedad", verificarToken, tokenAdmin, propiedadesControllers.crearPropiedad);

// Ruta para listar todas las propiedades
router.get("/obtenerPropiedades", propiedadesControllers.obtenerPropiedades);

// Ruta para obtener una propiedad por ID
router.get("/obtenerPropiedad/:id", verificarToken, tokenAdmin, propiedadesControllers.obtenerPropiedadPorId);

// Ruta para actualizar una propiedad por ID
router.put("/actualizarPropiedad/:id", verificarToken, tokenAdmin, propiedadesControllers.actualizarPropiedad);

// Ruta para eliminar una propiedad por ID
router.delete("/eliminarPropiedad/:id", verificarToken, tokenAdmin, propiedadesControllers.eliminarPropiedad);

module.exports = router;
