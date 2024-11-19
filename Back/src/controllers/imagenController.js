const Imagen = require('../models/imagenModel'); // Modelo Imagen

// 1. Obtener todas las imágenes de una propiedad
const obtenerImagenesPorPropiedad = async (req, res) => {
    const { id_propiedad } = req.params;

    try {
        // Buscar todas las imágenes asociadas a la propiedad
        const imagenes = await Imagen.findAll({
            where: { id_propiedad: id_propiedad }
        });

        if (imagenes.length === 0) {
            return res.status(404).json({ error: 'No se encontraron imágenes para esta propiedad' });
        }

        return res.status(200).json(imagenes);
    } catch (error) {
        console.error('Error al obtener las imágenes:', error);
        return res.status(500).json({ error: 'Error al obtener las imágenes' });
    }
};

module.exports = {
    obtenerImagenesPorPropiedad
};
