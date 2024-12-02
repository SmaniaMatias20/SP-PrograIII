const Usuario = require('../models/usuarioModel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const { crearUsuarioSchema } = require('../schemas/validacion');

// Clave secreta para firmar el token
const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta';

async function iniciarSesion(req, res) {
    try {
        const { usuario, password } = req.body;

        // Validar que se envíen ambos datos
        if (!usuario || !password) {
            return res.status(400).json({ success: false, mensaje: 'Faltan datos requeridos' });
        }

        // Buscar el usuario en la base de datos
        const usuarioExistente = await Usuario.findOne({ where: { usuario } });

        // Si no existe el usuario, retornar un error
        if (!usuarioExistente) {
            return res.status(400).json({ success: false, mensaje: 'Usuario no encontrado' });
        }

        // Verificar la contraseña usando bcrypt
        const isMatch = await bcrypt.compare(password, usuarioExistente.password);

        // Si las contraseñas no coinciden, retornar un error
        if (!isMatch) {
            return res.status(401).json({ success: false, mensaje: 'Contraseña incorrecta' });
        }

        // Crear el payload para el JWT, incluyendo el rol
        const payload = {
            usuario: usuarioExistente.usuario,
            rol: usuarioExistente.rol
        };

        // Firmar el JWT y enviarlo al usuario
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // El token expira en 1 hora

        // Retornar el token al cliente
        res.status(200).json({
            success: true,
            mensaje: 'Inicio de sesión exitoso',
            token: token // Se envía el token al cliente
        });
    } catch (error) {
        // Manejar errores
        res.status(400).json({ success: false, mensaje: 'Error al iniciar sesión', error: error.message });
    }
}

// Crear un nuevo usuario
async function crearUsuario(req, res) {
    try {
        // Validar los datos de entrada utilizando el esquema Zod
        const datosUsuario = req.body;

        crearUsuarioSchema.parse(datosUsuario); // Lanzará un error si los datos no son válidos

        // Desestructurar los datos del usuario
        const { usuario, rol, password } = datosUsuario;

        // Aquí podrías verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ where: { usuario } });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: 'El usuario ya existe' });
        }

        // Encriptar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario en la base de datos
        const nuevoUsuario = await Usuario.create({
            usuario,
            rol,
            password: hashedPassword, // Almacenar la contraseña cifrada
        });

        // Devolver respuesta exitosa
        res.status(201).json({ mensaje: 'Usuario creado exitosamente', nuevoUsuario });
    } catch (error) {

        // Si es un error de Zod (validación), enviar un mensaje específico
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                mensaje: 'Error de validación',
                detalles: error.errors, // Los detalles del error de validación de Zod
            });
        }

        // Si es otro error, devolver un mensaje genérico
        res.status(400).json({ mensaje: 'Error al crear el usuario', error: error.message });
    }
}

// Obtener todos los usuarios
async function obtenerUsuarios(req, res) {
    try {
        const usuarios = await Usuario.findAll();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los usuarios', error: error.message });
    }
}

// Obtener un usuario por ID
async function obtenerUsuarioPorId(req, res) {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el usuario', error: error.message });
    }
}

// Actualizar un usuario
async function actualizarUsuario(req, res) {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        await usuario.update(req.body);
        res.status(200).json({ mensaje: 'Usuario actualizado exitosamente', usuario });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar el usuario', error: error.message });
    }
}

// Eliminar un usuario
async function eliminarUsuario(req, res) {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        await usuario.destroy();
        res.status(200).json({ mensaje: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el usuario', error: error.message });
    }
}


// Exporta las funciones en el formato solicitado
module.exports = {
    iniciarSesion,
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
};

