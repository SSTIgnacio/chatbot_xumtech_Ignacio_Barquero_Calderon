const express = require('express');
const cors = require('cors');
const chatRoutes = require('./api/routes/chat.routes');

const app = express();

// Middlewares básicos
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite al servidor entender JSON

// Ruta principal de la API
app.use('/api', chatRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.send('API del Chatbot de XUMTECH funcionando correctamente.');
});

module.exports = app;