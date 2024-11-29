const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig.js');
// const bcrypt = require('bcrypt');

// Define el modelo Usuario
const Usuario = sequelize.define('usuario', {
    usuario: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Esto solo debe ser uno
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
            // Podrías agregar validaciones adicionales para la contraseña aquí
        }
    }
}, {
    tableName: 'usuario', // Asegúrate de que este nombre coincida con el de tu tabla en la base de datos
    timestamps: false // Cambia esto si decides usar timestamps
});

module.exports = Usuario;
