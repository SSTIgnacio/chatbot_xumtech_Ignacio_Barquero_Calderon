/**
 * @description Punto de entrada para iniciar el servidor de la aplicación.
 * Su única responsabilidad es importar la aplicación Express configurada y ponerla en marcha.
 */

// Importa la instancia de la aplicación Express desde app.js, donde ya está configurada.
const app = require('./app');
// Importa solo la variable 'port' desde el archivo de configuración.
const { port } = require('./config');

// Inicia el servidor y lo pone a escuchar peticiones en el puerto especificado.
// La función callback se ejecuta una vez que el servidor se ha iniciado correctamente.
app.listen(port, () => {
  // Muestra un mensaje en la consola para confirmar que el servidor está en línea y en qué puerto.
  console.log(`Servidor del chatbot escuchando en http://localhost:${port}`);
});
