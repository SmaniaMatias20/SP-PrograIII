const Articulo = require('../models/articuloModel');
const ImagenArticulo = require('../models/imagenArticuloModel');

// Crear un nuevo artículo
async function crearArticulo(req, res) {
    try {
        const articulo = await Articulo.create(req.body);
        res.status(201).json({ mensaje: 'Artículo creado exitosamente', articulo });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el artículo', error: error.message });
    }
}

// Obtener todos los artículos
async function obtenerArticulos(req, res) {
    try {
        // Base URL para producción
        const BASE_URL = 'https://sp-prograiii-fj7g.onrender.com'; // Cambia a tu dominio en producción

        // Obtener todos los artículos
        const articulos = await Articulo.findAll();

        // Obtener las imágenes relacionadas para cada artículo
        const articulosConImagen = [];

        for (const articulo of articulos) {
            // Encontrar las imágenes relacionadas con el artículo
            const imagenes = await ImagenArticulo.findAll({
                where: { id_articulo: articulo.id },
                attributes: ['url'],
            });

            // Ajustar las rutas de las imágenes
            const imagenesConRutaCorregida = imagenes.map(imagen => {
                // Normalizar las barras y corregir la ruta base
                const rutaPublica = imagen.url
                    .replace(/\\\\|\\/g, '/') // Reemplaza cualquier combinación de \ o \\ por /
                    .replace(/\/{2,}/g, '/') // Elimina barras repetidas //
                    .replace(/^.*?Back\/public\//, `${BASE_URL}/`); // Ajusta la ruta base a la URL pública

                return { ...imagen.toJSON(), url: rutaPublica }; // Asegurarse de devolver un objeto JSON
            });

            // Filtrar solo la imagen principal o asignar null si no hay imágenes
            const imagenPrincipal = imagenesConRutaCorregida.length > 0 ? imagenesConRutaCorregida[0].url : null;

            // Agregar el artículo con la imagen asociada
            articulosConImagen.push({
                ...articulo.toJSON(),
                imagen: imagenPrincipal,
            });

            console.log(articulosConImagen);
        }

        res.status(200).json(articulosConImagen);
    } catch (error) {
        console.error('Error al obtener los artículos:', error);
        res.status(500).json({ mensaje: 'Error al obtener los artículos', error: error.message });
    }
}


// Obtener un artículo por ID
async function obtenerArticuloPorId(req, res) {
    try {
        const articulo = await Articulo.findByPk(req.params.id);
        if (!articulo) {
            return res.status(404).json({ mensaje: 'Artículo no encontrado' });
        }
        res.status(200).json(articulo);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el artículo', error: error.message });
    }
}

// Actualizar un artículo
async function actualizarArticulo(req, res) {
    try {
        const articulo = await Articulo.findByPk(req.params.id);
        if (!articulo) {
            return res.status(404).json({ mensaje: 'Artículo no encontrado' });
        }
        await articulo.update(req.body);
        res.status(200).json({ mensaje: 'Artículo actualizado exitosamente', articulo });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar el artículo', error: error.message });
    }
}

// Eliminar un artículo
async function eliminarArticulo(req, res) {
    try {
        const articulo = await Articulo.findByPk(req.params.id);
        if (!articulo) {
            return res.status(404).json({ mensaje: 'Artículo no encontrado' });
        }
        await articulo.destroy();
        res.status(200).json({ mensaje: 'Artículo eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el artículo', error: error.message });
    }
}

// Exporta las funciones en el formato solicitado
module.exports = {
    crearArticulo,
    obtenerArticulos,
    obtenerArticuloPorId,
    actualizarArticulo,
    eliminarArticulo
};
