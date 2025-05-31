// vendas.routes.js ou dentro do seu routes geral
const express = require("express");
const router = express.Router();
const pool = require("../db"); // Seu pool de conexão com mysql2

router.post("/", async (req, res) => {
  const { cliente_id, total, metodo_pagamento, criado_por, produtos } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Inserir a venda
    const [vendaResult] = await conn.execute(
      `INSERT INTO vendas (cliente_id, total, metodo_pagamento, criado_por, criado_em)
       VALUES (?, ?, ?, ?, NOW())`,
      [cliente_id || null, total, metodo_pagamento, criado_por]
    );

    const vendaId = vendaResult.insertId;

    // 2. Inserir os itens da venda
    for (const item of produtos) {
      await conn.execute(
        `INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario)
         VALUES (?, ?, ?, ?)`,
        [vendaId, item.produto_id, item.quantidade, item.preco]
      );
    }

    await conn.commit();
    res.status(201).json({ message: "Venda registrada com sucesso!", venda_id: vendaId });
  } catch (error) {
    await conn.rollback();
    console.error("Erro ao registrar venda:", error);
    res.status(500).json({ error: "Erro ao registrar venda." });
  } finally {
    conn.release();
  }
});

module.exports = router;
