const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

router.post('/', async (req, res) => {
  const { usuario, senha } = req.body;

  try {
    const [rows] = await pool.execute('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);

    if (rows.length === 0) {
      return res.status(401).json({ mensagem: 'Usuário não encontrado' });
    }

    const user = rows[0];

    if (user.senha_temporaria) {
      if (senha !== user.senha) {
        return res.status(401).json({ mensagem: 'Senha incorreta' });
      }
      return res.json({ trocaSenhaObrigatoria: true, usuarioId: user.id });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: user.id, usuario: user.usuario }, 'seu-segredo-aqui', {
      expiresIn: '1h',
    });

    return res.json({ mensagem: 'Login bem-sucedido', token });

  } catch (error) {
    console.error('Erro no backend:', error);
    return res.status(500).json({ mensagem: 'Erro no servidor' });
  }
});

module.exports = router;
