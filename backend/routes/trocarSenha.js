const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');

const router = express.Router();

router.post('/', async (req, res) => {
  const { id, novaSenha } = req.body;

  try {
    const hash = await bcrypt.hash(novaSenha, 10);

    await pool.execute(
      'UPDATE usuarios SET senha = ?, senha_temporaria = 0 WHERE id = ?',
      [hash, id]
    );

    return res.json({ mensagem: 'Senha alterada com sucesso' });

  } catch (error) {
    console.error('Erro ao trocar senha:', error);
    return res.status(500).json({ mensagem: 'Erro no servidor ao atualizar a senha' });
  }
});

module.exports = router;
