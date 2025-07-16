/**
 * @description Carga y exporta las variables de configuración de la aplicación.
 */

// Carga las variables del archivo .env en process.env.
require('dotenv').config();

// Exporta un objeto con las configuraciones para ser usadas en la app.
module.exports = {
  // Puerto para el servidor, con 5000 como valor por defecto.
  port: process.env.PORT || 5000,

  // Clave de API para proteger los endpoints.
  apiKey: process.env.API_KEY,
};
