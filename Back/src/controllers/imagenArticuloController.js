const ImagenArticulo = require('../models/imagenArticuloModel');


const obtenerImagenesPorArticulo = async (req, res) => {
    const { id_articulo } = req.params;

    try {
        const imagenes = await ImagenArticulo.findAll({
            where: { id_articulo: id_articulo },
        });

        if (imagenes.length === 0) {
            return res.status(404).json({ error: 'No se encontraron imágenes para este artículo' });
        }

        return res.status(200).json(imagenes);
    } catch (error) {
        console.error('Error al obtener las imágenes:', error);
        return res.status(500).json({ error: 'Error al obtener las imágenes' });
    }
};

module.exports = {
    obtenerImagenesPorArticulo,
};
