const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig.js'); // Asegúrate de que esta ruta coincida con la configuración de tu base de datos

// Define el modelo Articulo
const Articulo = sequelize.define('articulo', { // Cambiar 'articulos' a 'articulo'
    id: {
        type: DataTypes.INTEGER, // Cambia de INT a INTEGER
        primaryKey: true,
        autoIncrement: true, // Campo id autoincremental
    },
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
    autor: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isString(value) {
                if (typeof value !== 'string') {
                    throw new Error('El campo autor debe ser una cadena de texto.');
                }
            }
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    fecha: {
        type: DataTypes.DATE, // Mantener como DATE ya que la tabla lo define así
        allowNull: false,
    }
}, {
    // Si estás usando un esquema en tu base de datos, puedes descomentar la línea de abajo
    // schema: 'articulos', // Asegúrate de que coincide con tu esquema
    tableName: 'articulo', // Cambiar 'articulos' a 'articulo'
    timestamps: false // Cambia esto si decides usar timestamps
});

module.exports = Articulo;
