const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig.js');

// Define el modelo Propiedad
const Propiedad = sequelize.define('propiedad', {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true, // Validación para que no esté vacío
            isString(value) {
                if (typeof value !== 'string') {
                    throw new Error('El campo nombre debe ser una cadena de texto.');
                }
            }
        }
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2), // Especificar precisión y escala
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
        defaultValue: '{"lat": 0, "lng": 0}', // Aquí puedes poner el valor por defecto que prefieras
        validate: {
            notEmpty: true, // Validación para que no esté vacío
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
    usuario_id: { // Clave foránea para el usuario que reserva la propiedad
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'usuario', // Nombre de la tabla de usuarios
            key: 'id'
        },
        validate: {
            isInt: true,
            min: 0
        }
    }
}, {
    // Si no estás usando un esquema, puedes eliminar esta línea
    // schema: 'propiedades',
    tableName: 'propiedad',
    timestamps: false
});

module.exports = Propiedad;
