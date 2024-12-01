const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig.js');

// Define el modelo Usuario
const Usuario = sequelize.define('usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // Define como clave primaria
        autoIncrement: true, // Habilita la auto-incrementación
        allowNull: false
    },
    usuario: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Garantiza unicidad en el campo usuario
        validate: {
            notEmpty: true,
        }
    },
    rol: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            esString(value) {
                if (typeof value !== 'string') {
                    throw new Error('El campo rol debe ser una cadena de texto.');
                }
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            esString(value) {
                if (typeof value !== 'string') {
                    throw new Error('El campo password debe ser una cadena de texto.');
                }
            }
            // Agrega validaciones adicionales para la contraseña si es necesario
        }
    }
}, {
    tableName: 'usuario', // Nombre de la tabla en la base de datos
    timestamps: false // Cambia esto si decides usar timestamps
});

module.exports = Usuario;
