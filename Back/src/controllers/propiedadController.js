const Propiedad = require('../models/propiedadModel'); // Asegúrate de que esta ruta coincida con la ubicación de tu modelo
const Imagen = require('../models/imagenModel');
const { Sequelize } = require('sequelize');

require('dotenv').config();


// Crear una nueva propiedad
async function crearPropiedad(req, res) {
    try {
        const propiedad = await Propiedad.create(req.body);
        res.status(201).json({ mensaje: 'Propiedad creada exitosamente', propiedad });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear la propiedad', error: error.message });
    }
}

async function obtenerPropiedades(req, res) {
    try {
        // Base URL para producción
        const BASE_URL = 'https://sp-prograiii-fj7g.onrender.com'; // Cambia a tu dominio en producción

        // Obtener todas las propiedades
        const propiedades = await Propiedad.findAll();

        // Obtener las imágenes relacionadas (por id_propiedad) para cada propiedad
        const propiedadesConImagen = [];

        for (const propiedad of propiedades) {
            // Encontrar las imágenes relacionadas con la propiedad
            const imagenes = await Imagen.findAll({
                where: { id_propiedad: propiedad.id },
                attributes: ['url'],
            });

            // Ajustar las rutas de las imágenes
            const imagenesConRutaCorregida = imagenes.map(imagen => {
                // Corrige las barras y reemplaza la ruta base
                const rutaPublica = imagen.url
                    .replace(/\\\\/g, '/') // Corrige las barras invertidas
                    .replace(/^.*?Back\/public\//, `${BASE_URL}/`); // Ajusta la ruta a producción

                return { ...imagen, url: rutaPublica };
            });

            // Filtrar solo la imagen 'propiedad.jpg'
            const imagenPropiedad = imagenesConRutaCorregida.find(imagen => imagen.url.includes('propiedad.jpg'));

            // Agregar la propiedad con la imagen asociada
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




// Obtener una propiedad por ID
async function obtenerPropiedadPorId(req, res) {
    try {
        // Obtener la propiedad por ID
        const propiedad = await Propiedad.findByPk(req.params.id);
        if (!propiedad) {
            return res.status(404).json({ mensaje: 'Propiedad no encontrada' });
        }

        // Base URL para producción
        const BASE_URL = 'https://sp-prograiii-fj7g.onrender.com'; // Cambia a tu dominio en producción

        // Obtener las imágenes relacionadas con la propiedad
        const imagenes = await Imagen.findAll({
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

        // Crear un array con las rutas corregidas de las imágenes
        const imagenesUrls = imagenes.map(imagen => {
            const rutaPublica = imagen.url
                .replace(/\\\\/g, '/') // Corrige las barras invertidas
                .replace(/^.*?Back\/public\//, `${BASE_URL}/`); // Ajusta la ruta a producción
            return rutaPublica; // Retornamos solo la URL de la imagen
        });

        // Responder con la propiedad, los nuevos atributos y las imágenes dentro del objeto propiedad
        res.status(200).json({
            ...propiedad.toJSON(),
            sanitarios: propiedad.sanitarios,   // Asegúrate de que este atributo exista en la base de datos
            estacionamiento: propiedad.estacionamiento, // Asegúrate de que este atributo exista en la base de datos
            dormitorio: propiedad.dormitorio, // Asegúrate de que este atributo exista en la base de datos
            reservada: propiedad.reservada,  // Asegúrate de que este atributo exista en la base de datos
            imagenes: imagenesUrls // Aquí incluimos las imágenes dentro de la propiedad
        });
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