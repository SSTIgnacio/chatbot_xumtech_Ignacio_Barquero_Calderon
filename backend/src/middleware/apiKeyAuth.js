/**
 * @description Middleware de Express para proteger rutas mediante una clave de API.
 */

// Importa solo la variable 'apiKey' desde el archivo de configuración centralizado.
const { apiKey } = require('../config');

/**
 * Valida la presencia y corrección de la API Key en la cabecera 'x-api-key'.
 * @param {object} req - Objeto de la petición de Express.
 * @param {object} res - Objeto de la respuesta de Express.
 * @param {function} next - Función para pasar el control al siguiente middleware.
 */
const apiKeyAuth = (req, res, next) => {
  // Extrae la clave de API enviada por el cliente desde las cabeceras HTTP.
  const providedApiKey = req.headers['x-api-key'];

  // Comprueba si la clave no fue proporcionada o si no coincide con la clave del servidor.
  if (!providedApiKey || providedApiKey !== apiKey) {
    // Si la validación falla, detiene la petición y devuelve un error 401 (No Autorizado).
    return res.status(401).json({ error: 'Acceso no autorizado. API Key inválida o no proporcionada.' });
  }

  // Si la clave es correcta, llama a next() para permitir que la petición continúe.
  next();
};

// Exporta la función del middleware para ser usada en los archivos de rutas.
module.exports = apiKeyAuth;
