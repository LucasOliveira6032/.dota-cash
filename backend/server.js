const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');


app.use(cors({
  origin: 'https://dota-cash-3p88.vercel.app', // ou '*', para testes
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

const loginRoutes = require('./routes/login');
app.use('/', loginRoutes);

// Outras rotas, como /produtos, etc.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


