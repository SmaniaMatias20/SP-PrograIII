const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

// Definición del modelo Propiedad
const Propiedad = sequelize.define('propiedad', {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isString(value) {
                if (typeof value !== 'string') {
                    throw new Error('El campo titulo debe ser una cadena de texto.');
                }
            }
        }
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    sanitarios: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 0
        }
    },
    dormitorio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 0
        }
    },
    estacionamiento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 0
        }
    },
    ubicacion: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '{"lat": 0, "lng": 0}',
        validate: {
            notEmpty: true,
            isString(value) {
                if (typeof value !== 'string') {
                    throw new Error('El campo ubicacion debe ser una cadena de texto.');
                }
            },
        }
    },
    reservada: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    tableName: 'propiedad',
    timestamps: false
});

module.exports = Propiedad;
