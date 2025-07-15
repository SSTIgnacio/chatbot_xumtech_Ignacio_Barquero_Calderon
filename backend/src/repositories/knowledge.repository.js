const fs = require('fs/promises');
const path = require('path');

// Ruta al archivo JSON que funciona como nuestra base de datos de conocimiento
const KNOWLEDGE_BASE_PATH = path.join(__dirname, '../../data/knowledge-base.json');

/**
 * Lee y parsea el archivo de la base de conocimiento.
 * @returns {Promise<Array<Object>>} Una promesa que resuelve a un array de objetos de conocimiento.
 */
const getKnowledgeBase = async () => {
  try {
    const data = await fs.readFile(KNOWLEDGE_BASE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer la base de conocimiento:', error);
    // Si hay un error (ej. el archivo no existe), devuelve un array vacío.
    return [];
  }
};

module.exports = {
  getKnowledgeBase,
};