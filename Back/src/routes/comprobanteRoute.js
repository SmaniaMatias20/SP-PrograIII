const express = require("express");
const router = express.Router();
const comprobanteControllers = require('../controllers/comprobanteController');
const { verificarToken, tokenAdmin } = require('../middlewares/authMiddleware');

// Ruta para crear una nueva propiedad
router.post("/crearComprobante", verificarToken, tokenAdmin, comprobanteControllers.crearComprobante);

// Ruta para listar todas las propiedades
router.get("/obtenerComprobantes", comprobanteControllers.obtenerComprobantes);

// Ruta para obtener una propiedad por ID
router.get("/obtenerComprobante/:id", verificarToken, tokenAdmin, comprobanteControllers.obtenerComprobantePorId);

// Ruta para eliminar una propiedad por ID
router.delete("/eliminarComprobante/:id", verificarToken, tokenAdmin, comprobanteControllers.eliminarComprobante);

module.exports = router;