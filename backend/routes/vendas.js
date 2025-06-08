// vendas.routes.js ou dentro do seu routes geral
const express = require("express");
const router = express.Router();
const pool = require("../db"); // Seu pool de conexão com mysql2


router.get("/", async (req, res) => {
  try {
    const [vendas] = await pool.execute(`
      SELECT 
        v.id, 
        DATE_FORMAT(v.criado_em, '%Y-%m-%d') AS data,
        c.nome AS cliente,
        v.total,
        v.metodo_pagamento
      FROM vendas v
      LEFT JOIN clientes c ON v.cliente_id = c.id
      ORDER BY v.id DESC
    `);
    res.json(vendas);
  } catch (error) {
    console.error("Erro ao buscar vendas:", error);
    res.status(500).json({ erro: "Erro ao buscar vendas." });
  }
});


// GET /vendas/:id/detalhes
router.get("/:id/detalhes", async (req, res) => {
  const { id } = req.params;

  try {
    const [itens] = await pool.execute(`
      SELECT 
        p.nome,
        iv.quantidade,
        iv.preco_unitario,
        (iv.quantidade * iv.preco_unitario) AS subtotal
      FROM itens_venda iv
      JOIN produtos p ON iv.produto_id = p.id
      WHERE iv.venda_id = ?
    `, [id]);

    res.json({ itens });
  } catch (error) {
    console.error("Erro ao buscar itens da venda:", error);
    res.status(500).json({ erro: "Erro ao buscar itens da venda." });
  }
});



router.post("/iniciar", async (req, res) => {
  try {
    const [result] = await pool.execute(
      "INSERT INTO vendas (total) VALUES (0)"
    );

    const vendaId = result.insertId;
    res.json({ vendaId });
  } catch (error) {
    console.error("Erro ao iniciar venda:", error);
    res.status(500).json({ erro: "Erro ao iniciar venda." });
  }
});

// POST /vendas/finalizar
router.post("/finalizar", async (req, res) => {
  const {
    venda_id,
    cliente_id,
    total,
    metodo_pagamento,
    criado_por,
    produtos,
  } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Atualiza a venda com os dados finais
    await connection.execute(
      `UPDATE vendas SET cliente_id = ?, total = ?, metodo_pagamento = ?, criado_por = ? WHERE id = ?`,
      [cliente_id, total, metodo_pagamento, criado_por, venda_id]
    );

    // 2. Insere os produtos da venda na tabela itens_vendas
    for (const item of produtos) {
        console.log("Item recebido para inserção:", item);
      await connection.execute(
        `INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)`,
        [venda_id, item.produto_id, item.quantidade, item.preco_unitario]
      );

      // 3. Atualiza o estoque do produto
      await connection.execute(
        `UPDATE produtos SET estoque = estoque - ? WHERE id = ?`,
        [item.quantidade, item.produto_id]
      );
    }

    await connection.commit();
    res.json({ sucesso: true });
  } catch (error) {
    await connection.rollback();
    console.error("Erro ao finalizar venda:", error);
    res.status(500).json({ erro: "Erro ao finalizar venda" });
  } finally {
    connection.release();
  }
});



router.post("/", async (req, res) => {
  const { cliente_id, total, metodo_pagamento, criado_por, produtos } = req.body;

  try {
    const connection = await pool.getConnection();

    // 1. Primeiro, insere a VENDA
    const [vendaResult] = await connection.execute(
      "INSERT INTO vendas (cliente_id, total, metodo_pagamento, criado_por) VALUES (?, ?, ?, ?)",
      [cliente_id, total, metodo_pagamento, criado_por]
    );

    const vendaId = vendaResult.insertId;
    console.log("Venda registrada com ID:", vendaId);

    // 2. Agora, insere os ITENS da venda
    for (const produto of produtos) {
      await connection.execute(
        "INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)",
        [
          vendaId,
          produto.produto_id,
          produto.quantidade,
          produto.preco_unitario,
        ]
      );
    }

    connection.release();
    res.status(201).json({ message: "Venda registrada com sucesso!" });
  } catch (error) {
    console.error("Erro ao registrar venda:", error);
    res.status(500).json({ error: "Erro ao registrar venda no banco de dados." });
  }
});



module.exports = router;
