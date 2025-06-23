const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: 'https://dota-cash-3p88.vercel.app', // Configuração de CORS para frontend na Vercel
    credentials: true
}));
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
