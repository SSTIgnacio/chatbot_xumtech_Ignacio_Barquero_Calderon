/**
 * @description Capa de acceso a datos para la base de conocimiento.
 * Abstrae la lógica de lectura de la fuente de datos (archivo JSON).
 */

// Importa la versión de promesas del módulo 'fs' (File System) para leer archivos de forma asíncrona.
const fs = require('fs/promises');
// Importa el módulo 'path' para construir rutas de archivo de manera segura y compatible entre sistemas operativos.
const path = require('path');

// Define la ruta absoluta al archivo JSON que actúa como nuestra base de datos.
// Usar path.join previene errores de rutas relativas (ej. './' o '../').
const KNOWLEDGE_BASE_PATH = path.join(__dirname, '../../data/knowledge-base.json');

/**
 * Lee y parsea de forma asíncrona el archivo de la base de conocimiento.
 * @returns {Promise<Array<Object>>} Una promesa que resuelve a un array de objetos de conocimiento.
 */
const getKnowledgeBase = async () => {
  // Se utiliza un bloque try...catch para manejar posibles errores, como que el archivo no exista.
  try {
    // Lee el contenido del archivo como texto en formato UTF-8.
    const data = await fs.readFile(KNOWLEDGE_BASE_PATH, 'utf-8');
    // Convierte el string JSON a un objeto/array de JavaScript.
    return JSON.parse(data);
  } catch (error) {
    // Si ocurre un error, lo muestra en la consola del servidor.
    console.error('Error al leer la base de conocimiento:', error);
    // Devuelve un array vacío como valor por defecto para que la aplicación no se rompa.
    return [];
  }
};

// Exporta la función para que pueda ser utilizada por la capa de servicios.
module.exports = {
  getKnowledgeBase,
};
