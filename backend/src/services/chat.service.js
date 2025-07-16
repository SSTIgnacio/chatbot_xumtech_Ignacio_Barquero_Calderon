/**
 * @description Contiene la lógica de negocio principal del chatbot.
 * Su responsabilidad es recibir un mensaje, procesarlo de forma segura y determinar la respuesta adecuada.
 */

// Importa la función para acceder a la base de conocimiento desde la capa de repositorio.
const { getKnowledgeBase } = require('../repositories/knowledge.repository');

/**
 * Procesa el mensaje de un usuario, lo sanitiza y busca una respuesta en la base de conocimiento.
 * @param {string} userMessage - El mensaje enviado por el usuario.
 * @returns {Promise<string>} Una promesa que resuelve a la respuesta encontrada o a un mensaje por defecto.
 */
const processMessage = async (userMessage) => {
  // 1. Validación de Entrada: Si el mensaje no existe o está vacío, devuelve una respuesta inmediata.
  if (!userMessage || !userMessage.trim()) {
    return 'Por favor, escribe una pregunta.';
  }

  // 2. Sanitización: Limpia la entrada del usuario para mejorar la seguridad y la fiabilidad de la búsqueda.
  //    - Convierte todo a minúsculas para una comparación consistente.
  //    - Elimina cualquier carácter que NO sea una letra, número o espacio para prevenir inyecciones (XSS).
  let cleanMessage = userMessage.toLowerCase().replace(/[^a-z0-9\s]/g, '');

  // 3. Acceso a Datos: Obtiene la base de conocimiento llamando a la función del repositorio.
  const knowledgeBase = await getKnowledgeBase();

  // 4. Lógica de Búsqueda: Itera sobre cada entrada de la base de conocimiento.
  for (const entry of knowledgeBase) {
    // Itera sobre cada palabra clave asociada a la entrada.
    for (const keyword of entry.keywords) {
      // Crea una expresión regular para buscar la palabra clave como una palabra completa.
      // El delimitador `\b` es crucial para evitar coincidencias parciales (ej. encontrar "hola" en "caracola").
      const keywordRegex = new RegExp(`\\b${keyword.toLowerCase()}\\b`);
      
      // Comprueba si la palabra clave existe en el mensaje ya sanitizado.
      if (keywordRegex.test(cleanMessage)) {
        // Si se encuentra una coincidencia, devuelve la respuesta y termina la función.
        return entry.answer;
      }
    }
  }

  // 5. Respuesta por Defecto: Si el bucle termina sin encontrar ninguna coincidencia, devuelve un mensaje estándar.
  return 'Lo siento, no he entendido tu pregunta. Puedes consultarme sobre nuestros servicios, tecnologías o información de contacto.';
};

// Exporta la función para que pueda ser utilizada por la capa de controladores.
module.exports = {
  processMessage,
};
