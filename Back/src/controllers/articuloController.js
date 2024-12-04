const Articulo = require('../models/articuloModel');
const ImagenArticulo = require('../models/imagenArticuloModel');


async function crearArticulo(req, res) {
    try {
        const articulo = await Articulo.create(req.body);
        res.status(201).json({ mensaje: 'Artículo creado exitosamente', articulo });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el artículo', error: error.message });
    }
}

async function obtenerArticulos(req, res) {
    try {
        const BASE_URL = 'https://sp-prograiii-fj7g.onrender.com';
        const articulos = await Articulo.findAll();
        const articulosConImagen = [];

        for (const articulo of articulos) {
            const imagenes = await ImagenArticulo.findAll({
                where: { id_articulo: articulo.id },
                attributes: ['url'],
            });
            const imagenesConRutaCorregida = imagenes.map(imagen => {
                const rutaPublica = imagen.url
                    .replace(/\\\\|\\/g, '/')
                    .replace(/\/{2,}/g, '/')
                    .replace(/^.*?Back\/public\//, `${BASE_URL}/`);

                return { ...imagen.toJSON(), url: rutaPublica };
            });

            const imagenPrincipal = imagenesConRutaCorregida.length > 0 ? imagenesConRutaCorregida[0].url : null;
            articulosConImagen.push({
                ...articulo.toJSON(),
                imagen: imagenPrincipal,
            });

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


module.exports = {
    crearArticulo,
    obtenerArticulos,
    obtenerArticuloPorId,
    actualizarArticulo,
    eliminarArticulo
};
