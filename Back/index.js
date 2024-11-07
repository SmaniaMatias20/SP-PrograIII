require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Routes = require('./src/routes/routes');
const sequelize = require('./src/config/dbConfig');

// Inicializar Express
const app = express();

// Puerto donde se va a correr el server
const PORT = process.env.PORT || 3000;

// Middleware para habilitar CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

//Rutas
app.use('/', Routes);

// Probar la conexión
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

// Sincronizar modelos con la base de datos
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Tablas sincronizadas con la base de datos.');
    } catch (error) {
        console.error('Error al sincronizar las tablas:', error);
    }
};

// Iniciar el servidor
app.listen(PORT, async () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    await testConnection(); // Probar la conexión al iniciar el servidor
    await syncDatabase(); // Sincronizar los modelos con la base de datos
});
