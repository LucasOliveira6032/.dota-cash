const express = require('express');
const router = express.Router();
const pool = require('../db'); // conexão com o MySQL

router.get('/resumo', async (req, res) => {
  try {
    const [totalProdutos] = await pool.query('SELECT COUNT(*) AS total FROM produtos');
    const [totalUnidades] = await pool.query('SELECT SUM(estoque) AS total FROM produtos');
    const [valorEstoque] = await pool.query('SELECT SUM(estoque * preco_custo) AS total FROM produtos');
    const [baixoEstoque] = await pool.query('SELECT COUNT(*) AS total FROM produtos WHERE estoque < 5');
    const [esgotados] = await pool.query('SELECT COUNT(*) AS total FROM produtos WHERE estoque = 0');

    res.json({
      totalProdutos: totalProdutos[0].total || 0,
      totalUnidades: totalUnidades[0].total || 0,
      valorEstoque: valorEstoque[0].total || 0,
      baixoEstoque: baixoEstoque[0].total || 0,
      esgotados: esgotados[0].total || 0,
    });
  } catch (err) {
    console.error('Erro ao buscar resumo:', err);
    res.status(500).json({ erro: 'Erro ao buscar resumo de estoque' });
  }
});

// Produtos com estoque menor que 5
router.get('/estoque-baixo', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, nome, estoque, preco_custo
      FROM produtos
      WHERE estoque > 0 AND estoque < 5
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar estoque baixo' });
  }
});

// Produtos esgotados
router.get('/produtos-esgotados', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, nome, estoque, preco_custo
      FROM produtos
      WHERE estoque = 0
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos esgotados' });
  }
});

module.exports = router;
