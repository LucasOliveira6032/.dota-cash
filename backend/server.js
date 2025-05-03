const app = require('./App'); 
const port = 3001;

// Outras rotas, como /produtos, etc.
app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});


