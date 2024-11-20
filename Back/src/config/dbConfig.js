// // src/config/dbConfig.js
// const { Sequelize } = require('sequelize');
// const dotenv = require('dotenv');

// dotenv.config(); // Cargar variables de entorno

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     dialect: 'mysql', // Asegúrate de usar 'mysql'
//     port: process.env.DB_PORT,
//     logging: false // Desactiva el logging de las consultas
// });

// module.exports = sequelize;

// src/config/dbConfig.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config(); // Cargar variables de entorno

// Cambia la configuración para usar SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite', // El archivo de base de datos SQLite
    logging: false // Desactiva el logging de las consultas
});

module.exports = sequelize;
