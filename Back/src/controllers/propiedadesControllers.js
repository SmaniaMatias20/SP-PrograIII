const Propiedad = require('../models/propiedadesModels'); // Asegúrate de que esta ruta coincida con la ubicación de tu modelo

// Crear una nueva propiedad
async function crearPropiedad(req, res) {
    try {
        const propiedad = await Propiedad.create(req.body);
        res.status(201).json({ mensaje: 'Propiedad creada exitosamente', propiedad });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear la propiedad', error: error.message });
    }
}

// Obtener todas las propiedades
async function obtenerPropiedades(req, res) {
    try {
        const propiedades = await Propiedad.findAll();
        res.status(200).json(propiedades);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las propiedades', error: error.message });
    }
}

// Obtener una propiedad por ID
async function obtenerPropiedadPorId(req, res) {
    try {
        const propiedad = await Propiedad.findByPk(req.params.id);
        if (!propiedad) {
            return res.status(404).json({ mensaje: 'Propiedad no encontrada' });
        }
        res.status(200).json(propiedad);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener la propiedad', error: error.message });
    }
}

// Actualizar una propiedad
async function actualizarPropiedad(req, res) {
    try {
        const propiedad = await Propiedad.findByPk(req.params.id);
        if (!propiedad) {
            return res.status(404).json({ mensaje: 'Propiedad no encontrada' });
        }
        await propiedad.update(req.body);
        res.status(200).json({ mensaje: 'Propiedad actualizada exitosamente', propiedad });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar la propiedad', error: error.message });
    }
}

// Eliminar una propiedad
async function eliminarPropiedad(req, res) {
    try {
        const propiedad = await Propiedad.findByPk(req.params.id);
        if (!propiedad) {
            return res.status(404).json({ mensaje: 'Propiedad no encontrada' });
        }
        await propiedad.destroy();
        res.status(200).json({ mensaje: 'Propiedad eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar la propiedad', error: error.message });
    }
}

// Exporta las funciones en el formato solicitado
module.exports = {
    crearPropiedad,
    obtenerPropiedades,
    obtenerPropiedadPorId,
    actualizarPropiedad,
    eliminarPropiedad
};