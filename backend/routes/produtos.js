const express = require('express');
const pool = require('../db');

const router = express.Router();

// Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM produtos');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ mensagem: 'Erro ao listar produtos' });
  }
});

// Buscar produto por código de Barras
router.get('/:codigo_barras', async (req, res) => {
  const codigo = req.params.codigo_barras.toString();
  console.log('Código recebido no backend:', codigo);
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM produtos WHERE (codigo_barras) = ?',
      [codigo] // ✅ usa o campo correto da tabela
    );

    if (rows.length === 0) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar produto' });
  }

  console.log('Linhas retornadas:', rows);
});


// Incluir novo produto
router.post('/', async (req, res) => {
  const { nome, descricao, preco, estoque, categoria_id, codigo_barras, imagem, criado_por } = req.body;
  try {
    const criado_em = new Date();
    const [result] = await pool.execute(
      `INSERT INTO produtos (nome, descricao, preco, estoque, categoria_id, codigo_barras, imagem, criado_por, criado_em)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, descricao, preco, estoque, categoria_id, codigo_barras, imagem, criado_por, criado_em]
    );
    res.status(201).json({ mensagem: 'Produto incluído com sucesso', id: result.insertId });
  } catch (error) {
    console.error('Erro ao incluir produto:', error);
    res.status(500).json({ mensagem: 'Erro ao incluir produto' });
  }
});

// Excluir produto por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM produtos WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }
    res.json({ mensagem: 'Produto excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({ mensagem: 'Erro ao excluir produto' });
  }
});

module.exports = router;
