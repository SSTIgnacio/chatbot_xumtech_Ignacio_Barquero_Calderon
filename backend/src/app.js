/**
 * @description Archivo principal de configuración de la aplicación Express.
 * Aquí se configuran los middlewares globales y se montan las rutas.
 */

// Importa el framework Express para crear el servidor.
const express = require('express');
// Importa el middleware 'cors' para permitir peticiones desde otros orígenes.
const cors = require('cors');
// Importa el enrutador que define los endpoints del chat.
const chatRoutes = require('./api/routes/chat.routes');

// Crea una instancia de la aplicación Express.
const app = express();

// --- Middlewares Globales ---

// Habilita CORS para permitir que el frontend (en otro puerto) se comunique con esta API.
app.use(cors()); 
// Habilita el parseo de cuerpos de petición en formato JSON.
app.use(express.json()); 

// --- Rutas ---

// Monta las rutas del chat bajo el prefijo '/api'.
// Cualquier ruta definida en chatRoutes (ej. '/chat') será accesible en '/api/chat'.
app.use('/api', chatRoutes);

// Define una ruta raíz de bienvenida para verificar fácilmente que el servidor está en línea.
app.get('/', (req, res) => {
  res.send('API del Chatbot de XUMTECH funcionando correctamente.');
});

// Exporta la instancia de la aplicación configurada para ser usada por server.js.
module.exports = app;
