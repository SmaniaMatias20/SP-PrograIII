const Usuario = require('../models/usuarioModel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const { crearUsuarioSchema } = require('../schemas/validacion');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta';

async function enviarCorreo(opciones) {
    try {
        const info = await transporter.sendMail(opciones);
        return { success: true, info };
    } catch (error) {
        return { success: false, error };
    }
}

async function manejarContacto(req, res) {

    const { nombre, email, telefono, mensaje } = req.body;
    const mailOptions = {
        from: email,
        to: 'enzo.ep@hotmail.com',
        subject: `Nuevo mensaje de contacto de ${nombre}`,
        text: `
        Nombre: ${nombre}
        Correo: ${email}
        Teléfono: ${telefono}
        Mensaje:
        ${mensaje}
        `
    };

    const resultado = await enviarCorreo(mailOptions);

    if (!resultado.success) {
        console.error(resultado.error);
        return res.status(500).json({ message: 'Error al enviar el correo' });
    }

    res.status(200).json({ message: 'Correo enviado correctamente' });
}


async function iniciarSesion(req, res) {
    try {
        const { usuario, password } = req.body;
        if (!usuario || !password) {
            return res.status(400).json({ success: false, mensaje: 'Faltan datos requeridos' });
        }

        const usuarioExistente = await Usuario.findOne({ where: { usuario } });

        if (!usuarioExistente) {
            return res.status(400).json({ success: false, mensaje: 'Usuario no encontrado' });
        }
        const isMatch = await bcrypt.compare(password, usuarioExistente.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, mensaje: 'Contraseña incorrecta' });
        }

        const payload = {
            usuario: usuarioExistente.usuario,
            rol: usuarioExistente.rol
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            success: true,
            mensaje: 'Inicio de sesión exitoso',
            token: token
        });
    } catch (error) {
        res.status(400).json({ success: false, mensaje: 'Error al iniciar sesión', error: error.message });
    }
}

async function crearUsuario(req, res) {
    try {
        const datosUsuario = req.body;
        crearUsuarioSchema.parse(datosUsuario);
        const { usuario, rol, password } = datosUsuario;
        const usuarioExistente = await Usuario.findOne({ where: { usuario } });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: 'El usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const nuevoUsuario = await Usuario.create({
            usuario,
            rol,
            password: hashedPassword,
        });

        res.status(201).json({ mensaje: 'Usuario creado exitosamente', nuevoUsuario });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                mensaje: 'Error de validación',
                detalles: error.errors,
            });
        }

        res.status(400).json({ mensaje: 'Error al crear el usuario', error: error.message });
    }
}

async function obtenerUsuarios(req, res) {
    try {
        const usuarios = await Usuario.findAll();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los usuarios', error: error.message });
    }
}

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

module.exports = {
    manejarContacto,
    iniciarSesion,
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario
};

