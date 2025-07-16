/**
 * @description Contiene la lógica de negocio principal del chatbot.
 * Su responsabilidad es recibir un mensaje, procesarlo de forma segura y determinar la respuesta adecuada.
 */

// Importa la función para acceder a la base de conocimiento desde la capa de repositorio.
const { getKnowledgeBase } = require('../repositories/knowledge.repository');

/**
 * Normaliza un texto: lo convierte a minúsculas y le quita los acentos (tildes).
 * Esta función es clave para comparar el input del usuario con las palabras clave.
 * @param {string} text - El texto a normalizar.
 * @returns {string} El texto normalizado (ej. "Días" -> "dias").
 */
const normalizeText = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize("NFD") // Separa los caracteres base de los diacríticos (ej. 'í' -> 'i' + '´')
    .replace(/[\u0300-\u036f]/g, ""); // Elimina los diacríticos (acentos)
};


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

  // 2. Normalización y Sanitización:
  //    - Primero, normalizamos el mensaje del usuario (minúsculas y sin tildes).
  const normalizedUserMessage = normalizeText(userMessage);
  //    - Luego, eliminamos cualquier carácter que NO sea una letra, número o espacio para seguridad.
  const cleanMessage = normalizedUserMessage.replace(/[^a-z0-9\s]/g, '');


  // 3. Acceso a Datos: Obtiene la base de conocimiento llamando a la función del repositorio.
  const knowledgeBase = await getKnowledgeBase();

  // 4. Lógica de Búsqueda: Itera sobre cada entrada de la base de conocimiento.
  for (const entry of knowledgeBase) {
    // Itera sobre cada palabra clave asociada a la entrada.
    for (const keyword of entry.keywords) {
      // Normaliza la palabra clave de la misma forma que el mensaje del usuario para una comparación justa.
      const normalizedKeyword = normalizeText(keyword);

      // Crea una expresión regular para buscar la palabra clave normalizada como una palabra completa.
      // El delimitador `\b` es crucial para evitar coincidencias parciales (ej. encontrar "hola" en "caracola").
      const keywordRegex = new RegExp(`\\b${normalizedKeyword}\\b`);
      
      // Comprueba si la palabra clave existe en el mensaje ya normalizado y sanitizado.
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
