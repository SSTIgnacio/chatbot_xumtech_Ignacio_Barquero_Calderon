/**
 * @description Define las rutas de la API relacionadas con la funcionalidad del chat.
 * Este archivo utiliza el enrutador de Express para mapear endpoints HTTP específicos
 * a sus correspondientes funciones controladoras, aplicando middlewares de seguridad
 * en el proceso.
 */

// Importa el framework Express para poder crear y gestionar rutas.
const express = require('express');

// Crea una nueva instancia del enrutador de Express.
// El router nos permite agrupar manejadores de rutas y middlewares.
const router = express.Router();

// --- Importación de Dependencias ---

// Importa el controlador de chat. El controlador contiene la lógica que se ejecutará
// cuando se acceda a la ruta, actuando como intermediario con la lógica de negocio.
const chatController = require('../../controllers/chat.controller');

// Importa el middleware de autenticación por API Key. Este middleware actuará como
// un "guardia de seguridad" para proteger nuestra ruta.
const apiKeyAuth = require('../../middleware/apiKeyAuth');


// --- Definición de la Ruta ---

/**
 * @route POST /chat
 * @description Endpoint para procesar un mensaje de chat enviado por un usuario.
 * @access Private (requiere API Key)
 * * Esta ruta define que para cualquier petición HTTP de tipo POST a la URL '/chat'
 * (que será '/api/chat' por el prefijo definido en app.js), se debe ejecutar una
 * secuencia de funciones.
 * * El flujo es el siguiente:
 * 1. La petición llega a la ruta.
 * 2. Se ejecuta el middleware `apiKeyAuth` para validar la cabecera 'x-api-key'.
 * 3. Si la clave es válida, `apiKeyAuth` llama a `next()`, y el control pasa a la
 * siguiente función: `chatController.handleChatMessage`.
 * 4. El controlador procesa la petición y envía una respuesta al cliente.
 */
router.post('/chat', apiKeyAuth, chatController.handleChatMessage);


// Exporta el enrutador configurado para que pueda ser utilizado por el archivo principal de la aplicación (app.js).
module.exports = router;
