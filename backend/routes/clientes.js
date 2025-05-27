const express = require('express');
const router = express.Router();
const pool = require('../db'); // já deve estar configurado

// Buscar cliente por CPF
router.get('/buscar-por-cpf/:cpf', async (req, res) => {
  const { cpf } = req.params;

  try {
    const [rows] = await pool.execute('SELECT * FROM clientes WHERE cpf = ?', [cpf]);

    if (rows.length === 0) {
      return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }

    return res.json(rows[0]); // retorna o cliente
  } catch (error) {
    console.error('Erro ao buscar cliente por CPF:', error);
    return res.status(500).json({ mensagem: 'Erro no servidor' });
  }
});

module.exports = router;
