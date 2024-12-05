const ImagenPropiedad = require('../models/imagenPropiedadModel');


/// <summary>
/// Obtiene una lista de imágenes asociadas a una propiedad específica por su ID.
/// </summary>
/// <param name="req">El objeto de solicitud que contiene el ID de la propiedad en los parámetros.</param>
/// <param name="res">El objeto de respuesta utilizado para enviar las imágenes obtenidas o un mensaje de error.</param>
/// <returns>Un objeto JSON con las imágenes asociadas a la propiedad, o un mensaje de error si no se encuentran imágenes o si ocurre un error.</returns>
/// <exception cref="Exception">Lanzada si ocurre un error al obtener las imágenes.</exception>
const obtenerImagenesPorPropiedad = async (req, res) => {
    const { id_propiedad } = req.params;

    try {
        const imagenes = await ImagenPropiedad.findAll({
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
