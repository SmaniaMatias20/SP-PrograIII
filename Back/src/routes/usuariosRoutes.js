const express = require("express");
const router = express.Router();
const usuariosControllers = require('../controllers/usuariosControllers');
const { verificarToken, tokenAdmin } = require('../middlewares/authMiddleware');

// Ruta para iniciar sesión
router.post("/iniciarSesion", usuariosControllers.iniciarSesion);

// Ruta para crear un nuevo usuario (solo admin puede hacerlo)
router.post("/crearUsuario", usuariosControllers.crearUsuario);

// Ruta para listar todos los usuarios (solo admin)
router.get("/obtenerUsuarios", verificarToken, tokenAdmin, usuariosControllers.obtenerUsuarios);

// Ruta para obtener un usuario por ID (solo admin puede hacerlo)
router.get("/obtenerUsuario/:id", verificarToken, tokenAdmin, usuariosControllers.obtenerUsuarioPorId);

// Ruta para actualizar un usuario por ID (solo admin puede hacerlo)
router.put("/actualizarUsuario/:id", verificarToken, tokenAdmin, usuariosControllers.actualizarUsuario);

// Ruta para eliminar un usuario por ID (solo admin puede hacerlo)
router.delete("/eliminarUsuario/:id", verificarToken, tokenAdmin, usuariosControllers.eliminarUsuario);

module.exports = router;
