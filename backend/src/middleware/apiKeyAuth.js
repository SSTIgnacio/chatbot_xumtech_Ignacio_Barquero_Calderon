const { apiKey } = require('../config');

/**
 * Middleware para verificar la API Key en las cabeceras de la petición.
 */
const apiKeyAuth = (req, res, next) => {
  const providedApiKey = req.headers['x-api-key'];

  if (!providedApiKey || providedApiKey !== apiKey) {
    return res.status(401).json({ error: 'Acceso no autorizado. API Key inválida o no proporcionada.' });
  }

  // Si la clave es correcta, permite que la petición continúe.
  next();
};

module.exports = apiKeyAuth;