const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

// Definición del modelo Imagen
const Imagen = sequelize.define('Imagen', {
    id_propiedad: {
        type: DataTypes.INTEGER,
        allowNull: false,  // Es obligatorio asociar la imagen a una propiedad
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,  // La URL de la imagen es obligatoria
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: true,  // Puede no ser obligatorio
        defaultValue: 'principal',  // Puede ser "principal", "secundaria", etc.
    }
}, {
    tableName: 'imagen',  // Nombre de la tabla en la base de datos
    timestamps: false  // No necesitas campos de fecha
});

module.exports = Imagen;
