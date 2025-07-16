/**
 * @description Maneja las peticiones HTTP para las rutas de chat.
 * Actúa como intermediario entre las rutas y la lógica de negocio (servicios).
 */

// Importa el servicio de chat, que contiene la lógica principal para procesar mensajes.
const chatService = require('../services/chat.service');

/**
 * Procesa una petición de chat entrante.
 * @param {object} req - Objeto de la petición de Express.
 * @param {object} res - Objeto de la respuesta de Express.
 */
const handleChatMessage = async (req, res) => {
  // Usa un bloque try...catch para manejar cualquier error inesperado durante el proceso.
  try {
    // Extrae la propiedad 'message' del cuerpo (body) de la petición JSON.
    const { message } = req.body;
    
    // Valida que el campo 'message' exista en la petición.
    if (!message) {
      // Si no existe, devuelve un error 400 (Bad Request) indicando el problema.
      return res.status(400).json({ error: 'El campo "message" es requerido.' });
    }

    // Delega el procesamiento del mensaje al servicio de chat.
    const reply = await chatService.processMessage(message);
    
    // Si todo va bien, envía la respuesta del bot en formato JSON con un estado 200 (OK).
    res.json({ reply });

  } catch (error) {
    // Si ocurre un error en cualquier punto del bloque 'try', se captura aquí.
    console.error('Error en el controlador de chat:', error);
    // Devuelve un error genérico 500 (Internal Server Error) al cliente.
    res.status(500).json({ error: 'Ocurrió un error interno en el servidor.' });
  }
};

// Exporta la función para que pueda ser utilizada en el archivo de rutas.
module.exports = {
  handleChatMessage,
};
