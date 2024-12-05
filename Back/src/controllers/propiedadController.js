const Propiedad = require('../models/propiedadModel');
const ImagenPropiedad = require('../models/imagenPropiedadModel');
const { Sequelize } = require('sequelize');
require('dotenv').config();

/// <summary>
/// Crea una nueva propiedad con la información proporcionada.
/// </summary>
/// <param name="req">El objeto de solicitud que contiene los datos de la propiedad.</param>
/// <param name="res">El objeto de respuesta utilizado para enviar el resultado de la operación.</param>
/// <returns>Un objeto JSON con un mensaje de éxito y la propiedad creada, o un mensaje de error.</returns>
/// <exception cref="Exception">Lanzada si ocurre un error al crear la propiedad.</exception>
async function crearPropiedad(req, res) {
    try {
        const propiedad = await Propiedad.create(req.body);
        res.status(201).json({ mensaje: 'Propiedad creada exitosamente', propiedad });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear la propiedad', error: error.message });
    }
}

/// <summary>
/// Obtiene una lista de todas las propiedades con sus imágenes asociadas.
/// </summary>
/// <param name="req">El objeto de solicitud.</param>
/// <param name="res">El objeto de respuesta utilizado para enviar las propiedades obtenidas con imágenes o un mensaje de error.</param>
/// <returns>Un objeto JSON con la lista de propiedades junto con la imagen principal, o un mensaje de error.</returns>
/// <exception cref="Exception">Lanzada si ocurre un error al obtener las propiedades o sus imágenes.</exception>
async function obtenerPropiedades(req, res) {
    try {
        const BASE_URL = 'https://sp-prograiii-fj7g.onrender.com';
        const propiedades = await Propiedad.findAll();
        const propiedadesConImagen = [];

        for (const propiedad of propiedades) {
            const imagenes = await ImagenPropiedad.findAll({
                where: { id_propiedad: propiedad.id },
                attributes: ['url'],
            });
            const imagenesConRutaCorregida = imagenes.map(imagen => {
                const rutaPublica = imagen.url
                    .replace(/\\\\|\\/g, '/')
                    .replace(/\/{2,}/g, '/')
                    .replace(/^.*?Back\/public\//, `${BASE_URL}/`);

                return { ...imagen.toJSON(), url: rutaPublica };
            });
            const imagenPropiedad = imagenesConRutaCorregida.find(imagen => imagen.url.includes('propiedad.jpg'));
            propiedadesConImagen.push({
                ...propiedad.toJSON(),
                imagen: imagenPropiedad ? imagenPropiedad.url : null,
            });
        }
        res.status(200).json(propiedadesConImagen);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las propiedades', error: error.message });
    }
}

/// <summary>
/// Obtiene una propiedad específica por su ID, junto con las imágenes asociadas (de baño, cocina y dormitorio).
/// </summary>
/// <param name="req">El objeto de solicitud que contiene el ID de la propiedad en los parámetros.</param>
/// <param name="res">El objeto de respuesta utilizado para enviar la propiedad obtenida junto con las imágenes o un mensaje de error.</param>
/// <returns>Un objeto JSON con los detalles de la propiedad y sus imágenes asociadas, o un mensaje de error si no se encuentra la propiedad o si ocurre un error.</returns>
/// <exception cref="Exception">Lanzada si ocurre un error al obtener la propiedad o sus imágenes.</exception>
async function obtenerPropiedadPorId(req, res) {
    try {
        const propiedad = await Propiedad.findByPk(req.params.id);
        if (!propiedad) {
            return res.status(404).json({ mensaje: 'Propiedad no encontrada' });
        }
        const BASE_URL = 'https://sp-prograiii-fj7g.onrender.com';
        const imagenes = await ImagenPropiedad.findAll({
            where: {
                id_propiedad: propiedad.id,
                url: {
                    [Sequelize.Op.or]: [
                        { [Sequelize.Op.like]: '%banio.jpg' },
                        { [Sequelize.Op.like]: '%cocina.jpg' },
                        { [Sequelize.Op.like]: '%dormitorio.jpg' }
                    ]
                }
            },
            attributes: ['url']
        });

        const imagenesUrls = imagenes.map(imagen => {
            const rutaPublica = imagen.url
                .replace(/\\\\/g, '/')
                .replace(/\/{2,}/g, '/')
                .replace(/^.*?Back\/public\//, `${BASE_URL}/`);
            return rutaPublica;
        });

        res.status(200).json({
            ...propiedad.toJSON(),
            sanitarios: propiedad.sanitarios,
            estacionamiento: propiedad.estacionamiento,
            dormitorio: propiedad.dormitorio,
            reservada: propiedad.reservada,
            imagenes: imagenesUrls
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener la propiedad', error: error.message });
    }
}

/// <summary>
/// Actualiza los detalles de una propiedad específica por su ID.
/// </summary>
/// <param name="req">El objeto de solicitud que contiene los datos de la propiedad a actualizar y el ID en los parámetros.</param>
/// <param name="res">El objeto de respuesta utilizado para enviar el resultado de la operación.</param>
/// <returns>Un objeto JSON con un mensaje de éxito y la propiedad actualizada, o un mensaje de error si no se encuentra la propiedad o si ocurre un error.</returns>
/// <exception cref="Exception">Lanzada si ocurre un error al actualizar la propiedad.</exception>
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

/// <summary>
/// Elimina una propiedad específica por su ID.
/// </summary>
/// <param name="req">El objeto de solicitud que contiene el ID de la propiedad a eliminar en los parámetros.</param>
/// <param name="res">El objeto de respuesta utilizado para enviar el resultado de la operación.</param>
/// <returns>Un objeto JSON con un mensaje de éxito, o un mensaje de error si no se encuentra la propiedad o si ocurre un error.</returns>
/// <exception cref="Exception">Lanzada si ocurre un error al eliminar la propiedad.</exception>
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

module.exports = {
    crearPropiedad,
    obtenerPropiedades,
    obtenerPropiedadPorId,
    actualizarPropiedad,
    eliminarPropiedad
};