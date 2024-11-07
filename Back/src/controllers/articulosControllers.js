const Articulo = require('../models/articulosModels'); // Asegúrate de que esta ruta coincida con la ubicación de tu modelo

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
        const articulos = await Articulo.findAll();
        res.status(200).json(articulos);
    } catch (error) {
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
