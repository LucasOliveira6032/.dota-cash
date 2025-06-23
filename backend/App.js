const express = require('express');
const cors = require('cors');
const app = express();

//acesso vercel
const allowedOrigins = ['https://dota-cash-3p88.vercel.app'];
app.use(cors(
  {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  }
}
));
app.use(express.json());

// Importar rotas separadas
const loginRoutes = require('./routes/login');
const trocarSenha = require('./routes/trocarSenha'); 
const produtosRoutes = require('./routes/produtos');
const clientes = require('./routes/clientes');
const vendas = require('./routes/vendas')
const estoqueRoutes = require('./routes/estoque');


// Usar as rotas
app.use('/login', loginRoutes);
app.use('/trocar-senha', trocarSenha);
app.use('/produtos', produtosRoutes);
app.use("/clientes", clientes);
app.use('/vendas', vendas);
app.use('/estoque', estoqueRoutes);

app.get('/', (req, res) => {
  res.send('API do .dotta-cash está online!');
});

module.exports = app;
