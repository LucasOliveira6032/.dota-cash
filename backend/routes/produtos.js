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
router.get("/:codigo", async (req, res) => {
  const { codigo } = req.params;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM produtos WHERE codigo_barras = ?",
      [codigo]
    );

    connection.release();
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    res.status(500).json({ error: "Erro ao buscar produto." });
  }
});



// Incluir novo produto
router.post('/', async (req, res) => {
  const {
    nome,
    descricao,
    preco_custo,
    preco_venda,
    estoque,
    categoria_id,
    codigo_barras,
    imagem,
    criado_por
  } = req.body;

  try {
    const [result] = await pool.execute(
      `INSERT INTO produtos (
        nome, descricao, preco_custo, preco_venda, estoque,
        categoria_id, codigo_barras, imagem, criado_por
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome ?? null,
        descricao ?? null,
        preco_custo ?? null,
        preco_venda ?? null,
        estoque ?? null,
        categoria_id ?? null,
        codigo_barras ?? null,
        imagem ?? null,
        criado_por ?? null
      ]
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

// Excluir produto
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

// Editar produto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    nome,
    descricao,
    preco_custo,
    preco_venda,
    estoque,
    categoria_id,
    codigo_barras,
    imagem,
    criado_por,
  } = req.body;

  try {
    // Atualiza o produto pelo id
    const [resultado] = await pool.execute(
      `UPDATE produtos SET 
        nome = ?, descricao = ?, preco_custo = ?, preco_venda = ?,
        estoque = ?, categoria_id = ?, codigo_barras = ?, imagem = ?, criado_por = ?
      WHERE id = ?`,
      [
        nome, descricao, preco_custo, preco_venda,
        estoque, categoria_id, codigo_barras, imagem, criado_por,
        id
      ]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    res.json({ mensagem: 'Produto atualizado com sucesso' });
  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ mensagem: 'Código de barras já existe para outro produto.' });
    }
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro no servidor' });
  }
});


module.exports = router;
