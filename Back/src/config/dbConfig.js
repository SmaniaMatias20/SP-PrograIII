// src/config/dbConfig.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config(); // Cargar variables de entorno

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql', // Asegúrate de usar 'mysql'
    port: process.env.DB_PORT,
    logging: false // Desactiva el logging de las consultas
});

module.exports = sequelize;
