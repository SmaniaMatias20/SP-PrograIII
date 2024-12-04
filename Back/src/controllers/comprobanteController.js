const Comprobante = require('../models/comprobanteModel');
require('dotenv').config();


async function crearComprobante(req, res) {
    try {
        const comprobante = await Comprobante.create(req.body);
        res.status(201).json({ mensaje: 'Comprobante creado exitosamente', comprobante });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el comprobante', error: error.message });
    }
}


async function obtenerComprobantes(req, res) {
    try {
        const comprobantes = await Comprobante.findAll();
        res.status(200).json(comprobantes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los comprobantes', error: error.message });
    }
}

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
        const { nombre_usuario } = req.params;

        const comprobantes = await Comprobante.findAll({
            where: { nombre_usuario }
        });

        res.status(200).json(comprobantes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los comprobantes', error: error.message });
    }
}


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
