const app = require('./app');
const { port } = require('./config');

app.listen(port, () => {
  console.log(`Servidor del chatbot escuchando en http://localhost:${port}`);
});
