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

/// <summary>
/// Envía un correo electrónico utilizando las opciones proporcionadas.
/// </summary>
/// <param name="opciones">El objeto que contiene las opciones necesarias para el envío del correo (como el destinatario, asunto, cuerpo, etc.).</param>
/// <returns>Un objeto con la propiedad `success` indicando si el envío fue exitoso o no, junto con la información o el error generado.</returns>
/// <exception cref="Exception">Lanzada si ocurre un error al enviar el correo.</exception>
async function enviarCorreo(opciones) {
    try {
        const info = await transporter.sendMail(opciones);
        return { success: true, info };
    } catch (error) {
        return { success: false, error };
    }
}

/// <summary>
/// Maneja el envío de un mensaje de contacto desde el usuario hacia el destinatario especificado.
/// </summary>
/// <param name="req">El objeto de solicitud que contiene la información del contacto, como nombre, email, teléfono y mensaje.</param>
/// <param name="res">El objeto de respuesta utilizado para enviar el resultado de la operación.</param>
/// <returns>Un objeto JSON con un mensaje indicando si el correo fue enviado correctamente o si ocurrió un error.</returns>
/// <exception cref="Exception">Lanzada si ocurre un error al enviar el correo.</exception>
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

/// <summary>
/// Inicia sesión de un usuario, validando su nombre de usuario y contraseña, y generando un token JWT si la autenticación es exitosa.
/// </summary>
/// <param name="req">El objeto de solicitud que contiene los datos de inicio de sesión (usuario y contraseña).</param>
/// <param name="res">El objeto de respuesta utilizado para enviar el resultado de la operación.</param>
/// <returns>Un objeto JSON con un mensaje de éxito o error, junto con el token de autenticación si el inicio de sesión es exitoso.</returns>
/// <exception cref="Exception">Lanzada si ocurre un error al intentar iniciar sesión, como un fallo en la verificación de la contraseña o en la búsqueda del usuario.</exception>
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
            token: token,
            rol: usuarioExistente.rol
        });
    } catch (error) {
        res.status(400).json({ success: false, mensaje: 'Error al iniciar sesión', error: error.message });
    }
}

/// <summary>
/// Crea un nuevo usuario, verificando que el usuario no exista previamente y validando los datos recibidos.
/// </summary>
/// <param name="req">El objeto de solicitud que contiene los datos del nuevo usuario (usuario, rol y contraseña).</param>
/// <param name="res">El objeto de respuesta utilizado para enviar el resultado de la operación.</param>
/// <returns>Un objeto JSON con un mensaje de éxito o error, y los detalles del nuevo usuario si la creación es exitosa.</returns>
/// <exception cref="ZodError">Lanzada si los datos del usuario no cumplen con la validación definida.</exception>
/// <exception cref="Exception">Lanzada si ocurre un error en la creación del usuario o en el proceso de hash de la contraseña.</exception>
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

/// <summary>
/// Obtiene una lista de todos los usuarios registrados.
/// </summary>
/// <param name="req">El objeto de solicitud que puede incluir filtros o parámetros adicionales (en este caso, no se requieren).</param>
/// <param name="res">El objeto de respuesta utilizado para enviar la lista de usuarios o un mensaje de error.</param>
/// <returns>Una lista de objetos JSON que representan a los usuarios registrados.</returns>
/// <exception cref="Exception">Lanzada si ocurre un error al intentar obtener los usuarios desde la base de datos.</exception>
async function obtenerUsuarios(req, res) {
    try {
        const usuarios = await Usuario.findAll();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los usuarios', error: error.message });
    }
}

/// <summary>
/// Obtiene los detalles de un usuario específico mediante su ID.
/// </summary>
/// <param name="req">El objeto de solicitud que contiene el ID del usuario a obtener en `req.params.id`.</param>
/// <param name="res">El objeto de respuesta utilizado para enviar los detalles del usuario o un mensaje de error.</param>
/// <returns>Un objeto JSON que representa al usuario con el ID especificado, o un mensaje de error si no se encuentra.</returns>
/// <exception cref="Exception">Lanzada si ocurre un error al intentar obtener el usuario desde la base de datos.</exception>
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

/// <summary>
/// Actualiza los detalles de un usuario específico mediante su ID.
/// </summary>
/// <param name="req">El objeto de solicitud que contiene el ID del usuario a actualizar en `req.params.id`, y los nuevos datos del usuario en `req.body`.</param>
/// <param name="res">El objeto de respuesta utilizado para enviar el resultado de la operación o un mensaje de error.</param>
/// <returns>Un objeto JSON con el mensaje de éxito y los detalles del usuario actualizado, o un mensaje de error si el usuario no existe o la actualización falla.</returns>
/// <exception cref="Exception">Lanzada si ocurre un error al intentar actualizar el usuario en la base de datos.</exception>
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

/// <summary>
/// Elimina un usuario específico mediante su ID.
/// </summary>
/// <param name="req">El objeto de solicitud que contiene el ID del usuario a eliminar en `req.params.id`.</param>
/// <param name="res">El objeto de respuesta utilizado para enviar el mensaje de éxito o un mensaje de error.</param>
/// <returns>Un mensaje de éxito si el usuario es eliminado correctamente, o un mensaje de error si el usuario no existe o la eliminación falla.</returns>
/// <exception cref="Exception">Lanzada si ocurre un error al intentar eliminar el usuario desde la base de datos.</exception>
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

