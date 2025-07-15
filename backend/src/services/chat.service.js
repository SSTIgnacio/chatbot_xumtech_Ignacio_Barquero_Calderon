const { getKnowledgeBase } = require('../repositories/knowledge.repository');

/**
 * Procesa el mensaje de un usuario buscando coincidencias de palabras clave en la base de conocimiento.
 * @param {string} userMessage - El mensaje enviado por el usuario.
 * @returns {Promise<string>} Una promesa que resuelve a la respuesta encontrada o un mensaje por defecto.
 */
const processMessage = async (userMessage) => {
  if (!userMessage) {
    return 'Por favor, escribe una pregunta.';
  }

  // Convertir el mensaje del usuario a minúsculas para una comparación sin distinción de mayúsculas/minúsculas.
  const lowerCaseMessage = userMessage.toLowerCase();

  // Obtener la base de conocimiento.
  const knowledgeBase = await getKnowledgeBase();

  // Buscar una respuesta en la base de conocimiento.
  for (const entry of knowledgeBase) {
    // Para cada entrada, revisar si alguna de sus palabras clave está en el mensaje del usuario.
    for (const keyword of entry.keywords) {
      if (lowerCaseMessage.includes(keyword.toLowerCase())) {
        // Si se encuentra una coincidencia, devolver la respuesta correspondiente.
        return entry.answer;
      }
    }
  }

  // Si después de revisar toda la base de conocimiento no se encuentra una respuesta, devolver un mensaje por defecto.
  return 'Lo siento, no he entendido tu pregunta. Puedes consultarme sobre nuestros servicios, tecnologías o información de contacto.';
};

module.exports = {
  processMessage,
};