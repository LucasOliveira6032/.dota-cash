const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
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

module.exports = app;
