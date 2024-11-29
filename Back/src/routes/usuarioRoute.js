const express = require("express");
const router = express.Router();
const usuariosControllers = require('../controllers/usuarioController');
const { verificarToken, tokenAdmin } = require('../middlewares/authMiddleware');

// Ruta para iniciar sesión
router.post("/iniciarSesion", usuariosControllers.iniciarSesion);

// Ruta para crear un nuevo usuario (solo admin puede hacerlo)
router.post("/crearUsuario", usuariosControllers.crearUsuario);

// Ruta para listar todos los usuarios (solo admin)
router.get("/obtenerUsuarios", usuariosControllers.obtenerUsuarios);

// Ruta para obtener un usuario por ID (solo admin puede hacerlo)
router.get("/obtenerUsuario/:id", usuariosControllers.obtenerUsuarioPorId);

// Ruta para actualizar un usuario por ID (solo admin puede hacerlo)
router.put("/actualizarUsuario/:id", usuariosControllers.actualizarUsuario);

// Ruta para eliminar un usuario por ID (solo admin puede hacerlo)
router.delete("/eliminarUsuario/:id", usuariosControllers.eliminarUsuario);

module.exports = router;
