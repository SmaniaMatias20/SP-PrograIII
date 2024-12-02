const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

// Definición del modelo Imagen
const ImagenPropiedad = sequelize.define('imagen_propiedad', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Define como clave primaria
        autoIncrement: true, // Habilita la auto-incrementación
        allowNull: false
    },
    id_propiedad: {
        type: DataTypes.INTEGER,
        allowNull: false, // Es obligatorio asociar la imagen a una propiedad
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false, // La URL de la imagen es obligatoria
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: true, // Puede no ser obligatorio
        defaultValue: 'principal', // Puede ser "principal", "secundaria", etc.
    }
}, {
    tableName: 'imagen_propiedad', // Nombre de la tabla en la base de datos
    timestamps: false // No necesitas campos de fecha
});

module.exports = ImagenPropiedad;
