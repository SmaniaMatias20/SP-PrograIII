require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Routes = require('./src/routes/routes');
const sequelize = require('./src/config/dbConfig');

// Inicializar Express
const app = express();

// Middleware para servir imágenes desde la carpeta 'public'
// Configurar la ruta para servir imágenes desde 'public/anuncios' y 'public/articulos'
// app.use('/images/anuncios', express.static(path.join(__dirname, 'public', 'anuncios')));
// app.use('/images/articulos', express.static(path.join(__dirname, 'public', 'articulos')));
app.use('/anuncios', express.static(path.join(__dirname, 'public', 'anuncios')));
app.use('/articulos', express.static(path.join(__dirname, 'public', 'articulos')));


// Puerto donde se va a correr el server
const PORT = process.env.PORT || 3000;

// Middleware para habilitar CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

//Rutas
app.use('/', Routes);

// Ruta para enviar la URL de la API al frontend
app.get('/config', (req, res) => {
    res.json({
        apiUrl: process.env.API_URL // Esto devolverá la URL según el entorno
    });
});

// Probar la conexión
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

(async () => {
    try {
        await sequelize.query('DROP TABLE IF EXISTS propiedad_backup;');
        console.log('Tabla de respaldo eliminada');
    } catch (error) {
        console.error('Error al eliminar la tabla de respaldo:', error);
    }
})();

(async () => {
    try {
        await sequelize.query('DROP TABLE IF EXISTS articulo_backup;');
        console.log('Tabla de respaldo eliminada');
    } catch (error) {
        console.error('Error al eliminar la tabla de respaldo:', error);
    }
})();

(async () => {
    try {
        await sequelize.query('UPDATE propiedad SET reservada = false;');
        console.log('Todas las propiedades han sido marcadas como no reservadas');
    } catch (error) {
        console.error('Error al actualizar las propiedades:', error);
    }
})();



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
