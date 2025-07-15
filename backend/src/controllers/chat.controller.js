const chatService = require('../services/chat.service');

/**
 * Maneja las peticiones de chat entrantes.
 */
const handleChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'El campo "message" es requerido.' });
    }

    const reply = await chatService.processMessage(message);
    
    res.json({ reply });

  } catch (error) {
    console.error('Error en el controlador de chat:', error);
    res.status(500).json({ error: 'Ocurrió un error interno en el servidor.' });
  }
};

module.exports = {
  handleChatMessage,
};
