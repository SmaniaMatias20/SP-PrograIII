const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig.js');

const Comprobante = sequelize.define('comprobante', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    fecha_reserva: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_propiedad: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
    },
    titulo_propiedad: {
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
    nombre_usuario: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    precio_propiedad: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'comprobante', // Nombre de la tabla en la base de datos
    timestamps: false // Si no necesitas createdAt y updatedAt
});

module.exports = Comprobante;