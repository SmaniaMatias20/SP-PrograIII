const Comprobante = require('../models/comprobanteModel');
require('dotenv').config();

/// <summary>
/// Crea un nuevo comprobante con la información proporcionada.
/// </summary>
/// <param name="req">El objeto de solicitud que contiene los datos del comprobante.</param>
/// <param name="res">El objeto de respuesta utilizado para enviar el resultado de la operación.</param>
/// <returns>Un objeto JSON con un mensaje de éxito y el comprobante creado, o un mensaje de error.</returns>
/// <exception cref="Exception">Lanzada si ocurre un error al crear el comprobante.</exception>
async function crearComprobante(req, res) {
    try {
        const comprobante = await Comprobante.create(req.body);
        res.status(201).json({ mensaje: 'Comprobante creado exitosamente', comprobante });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el comprobante', error: error.message });
    }
}

/// </summary>
/// <param name="req">El objeto de solicitud.</param>
/// <param name="res">El objeto de respuesta utilizado para enviar los comprobantes obtenidos.</param>
/// <returns>Un objeto JSON con la lista de comprobantes obtenidos, o un mensaje de error.</returns>
/// <exception cref="Exception">Lanzada si ocurre un error al obtener los comprobantes.</exception>
async function obtenerComprobantes(req, res) {
    try {
        const comprobantes = await Comprobante.findAll();
        res.status(200).json(comprobantes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los comprobantes', error: error.message });
    }
}

/// <summary>
/// Obtiene un comprobante específico por su ID.
/// </summary>
/// <param name="req">El objeto de solicitud que contiene el ID del comprobante en los parámetros.</param>
/// <param name="res">El objeto de respuesta utilizado para enviar el comprobante obtenido o un mensaje de error.</param>
/// <returns>Un objeto JSON con el comprobante solicitado, o un mensaje indicando que no fue encontrado o hubo un error.</returns>
/// <exception cref="Exception">Lanzada si ocurre un error al buscar el comprobante.</exception>
async function obtenerComprobantePorId(req, res) {
    try {
        const comprobante = await Comprobante.findByPk(req.params.id);
        if (!comprobante) {
            return res.status(404).json({ mensaje: 'Comprobante no encontrado' });
        }
        res.status(200).json(comprobante);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el comprobante', error: error.message });
    }
}


/// <summary>
/// Obtiene una lista de comprobantes asociados a un nombre de usuario específico.
/// </summary>
/// <param name="req">El objeto de solicitud que contiene el nombre de usuario en los parámetros.</param>
/// <param name="res">El objeto de respuesta utilizado para enviar los comprobantes obtenidos o un mensaje de error.</param>
/// <returns>Un objeto JSON con la lista de comprobantes asociados al nombre de usuario, o un mensaje de error.</returns>
/// <exception cref="Exception">Lanzada si ocurre un error al obtener los comprobantes.</exception>
async function obtenerComprobantesPorNombreUsuario(req, res) {
    try {
        const { nombre_usuario } = req.params;

        const comprobantes = await Comprobante.findAll({
            where: { nombre_usuario }
        });

        res.status(200).json(comprobantes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los comprobantes', error: error.message });
    }
}


/// <summary>
/// Elimina un comprobante específico por su ID.
/// </summary>
/// <param name="req">El objeto de solicitud que contiene el ID del comprobante en los parámetros.</param>
/// <param name="res">El objeto de respuesta utilizado para enviar el resultado de la operación.</param>
/// <returns>Un objeto JSON con un mensaje de éxito si el comprobante se elimina correctamente, o un mensaje de error.</returns>
/// <exception cref="Exception">Lanzada si ocurre un error al buscar o eliminar el comprobante.</exception>
async function eliminarComprobante(req, res) {
    try {
        const comprobante = await Comprobante.findByPk(req.params.id);
        if (!comprobante) {
            return res.status(404).json({ mensaje: 'Comprobante no encontrado' });
        }
        await comprobante.destroy();
        res.status(200).json({ mensaje: 'Comprobante eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el comprobante', error: error.message });
    }
}


module.exports = {
    crearComprobante,
    obtenerComprobantes,
    obtenerComprobantePorId,
    obtenerComprobantesPorNombreUsuario,
    eliminarComprobante
};
