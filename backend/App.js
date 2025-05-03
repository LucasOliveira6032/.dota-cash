const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Importar rotas separadas
const loginRoutes = require('./routes/login');
const trocarSenha = require('./routes/trocarSenha'); 

// Usar as rotas
app.use('/login', loginRoutes);
app.use('/trocar-senha', trocarSenha);

module.exports = app;
