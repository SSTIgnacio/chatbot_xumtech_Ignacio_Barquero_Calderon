// Carga las variables de entorno del archivo .env
require('dotenv').config();

// Exporta la configuración para que esté disponible en toda la aplicación
module.exports = {
  port: process.env.PORT || 5000,
  apiKey: process.env.API_KEY,
};