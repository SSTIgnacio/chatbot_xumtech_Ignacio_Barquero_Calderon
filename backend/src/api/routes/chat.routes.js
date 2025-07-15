const express = require('express');
const router = express.Router();
const chatController = require('../../controllers/chat.controller');
const apiKeyAuth = require('../../middleware/apiKeyAuth');

// Define la ruta POST para el chat, protegida por el middleware de API Key.
router.post('/chat', apiKeyAuth, chatController.handleChatMessage);

module.exports = router;
