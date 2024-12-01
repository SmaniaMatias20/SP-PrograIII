const express = require("express");
const router = express.Router();
const comprobanteControllers = require('../controllers/comprobanteController');
const { verificarToken, tokenAdmin } = require('../middlewares/authMiddleware');

// Ruta para crear una nuevo comprobante
router.post("/crearComprobante", comprobanteControllers.crearComprobante);

// Ruta para listar todos los comprobantes
router.get("/obtenerComprobantes", comprobanteControllers.obtenerComprobantes);

// Ruta para obtener un comprobante por id
router.get("/obtenerComprobante/:id", comprobanteControllers.obtenerComprobantePorId);

// Ruta para obtener los comprobantes por nombre de usuario
router.get("/obtenerComprobante/:nombre_usuario", comprobanteControllers.obtenerComprobantesPorNombreUsuario);

// Ruta para eliminar una propiedad por ID
router.delete("/eliminarComprobante/:id", comprobanteControllers.eliminarComprobante);

module.exports = router;