const { getKnowledgeBase } = require('../repositories/knowledge.repository');

/**
 * Procesa el mensaje de un usuario buscando coincidencias de palabras clave en la base de conocimiento.
 * @param {string} userMessage - El mensaje enviado por el usuario.
 * @returns {Promise<string>} Una promesa que resuelve a la respuesta encontrada o un mensaje por defecto.
 */
const processMessage = async (userMessage) => {
  if (!userMessage || !userMessage.trim()) {
    return 'Por favor, escribe una pregunta.';
  }

  // **CORRECCIÓN DE SEGURIDAD FINAL:**
  // 1. Convertir a minúsculas.
  let cleanMessage = userMessage.toLowerCase();
  
  // 2. Sanitización agresiva: Eliminar todo lo que NO sea una letra, un número o un espacio en blanco.
  // Esto convierte '<script>alert("hola")</script>' en 'script alert hola script'.
  cleanMessage = cleanMessage.replace(/[^a-z0-9\s]/g, '');

  // Obtener la base de conocimiento.
  const knowledgeBase = await getKnowledgeBase();

  // Buscar una respuesta en la base de conocimiento.
  for (const entry of knowledgeBase) {
    for (const keyword of entry.keywords) {
      // 3. Crear una expresión regular que busque la palabra clave como una palabra completa.
      const keywordRegex = new RegExp(`\\b${keyword.toLowerCase()}\\b`);
      
      if (keywordRegex.test(cleanMessage)) {
        // Si se encuentra una coincidencia en el texto ya limpio, devolver la respuesta.
        return entry.answer;
      }
    }
  }

  // Si no se encuentra ninguna coincidencia, devolver el mensaje por defecto.
  return 'Lo siento, no he entendido tu pregunta. Puedes consultarme sobre nuestros servicios, tecnologías o información de contacto.';
};

module.exports = {
  processMessage,
};
