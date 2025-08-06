const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');

const allowedOrigins = ['https://dota-cash-3p88.vercel.app'];
app.use(cors({
  origin: allowedOrigins, 
  methods: ['GET', 'POST'],
  credentials: true
}
));

app.use(express.json());

const loginRoutes = require('./routes/login');
app.use('/', loginRoutes);

// Outras rotas, como /produtos, etc.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


