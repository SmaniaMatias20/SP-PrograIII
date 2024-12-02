const Comprobante = require('../models/comprobanteModel'); // Asegúrate de que esta ruta coincida con la ubicación de tu modelo
require('dotenv').config();

// Crear un nuevo comprobante
async function crearComprobante(req, res) {
    try {
        const comprobante = await Comprobante.create(req.body);
        res.status(201).json({ mensaje: 'Comprobante creado exitosamente', comprobante });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el comprobante', error: error.message });
    }
}

// Obtener todos los comprobantes
async function obtenerComprobantes(req, res) {
    try {
        const comprobantes = await Comprobante.findAll();
        res.status(200).json(comprobantes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los comprobantes', error: error.message });
    }
}

// Obtener un comprobante por ID
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

async function obtenerComprobantesPorNombreUsuario(req, res) {
    try {
        console.log("hola");
        const { nombre_usuario } = req.params; // Obtener el nombre_usuario de los parámetros de la ruta

        const comprobantes = await Comprobante.findAll({
            where: { nombre_usuario } // Filtrar por nombre_usuario
        });

        if (comprobantes.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron comprobantes para el usuario especificado' });
        }

        res.status(200).json(comprobantes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los comprobantes', error: error.message });
    }
}

// Eliminar un comprobante
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

// Exporta las funciones en el formato solicitado
module.exports = {
    crearComprobante,
    obtenerComprobantes,
    obtenerComprobantePorId,
    obtenerComprobantesPorNombreUsuario,
    eliminarComprobante
};
