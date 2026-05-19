import { db } from '../database/db.js';

export async function listarContas(req, res) {
  const result = await db.query('SELECT * FROM contas ORDER BY id DESC');
  res.json(result.rows);
}

export async function criarConta(req, res) {
  const { nome, tipo, saldo_inicial = 0 } = req.body;

  if (!nome || !tipo) {
    return res.status(400).json({ error: 'Nome e tipo são obrigatórios.' });
  }

  const result = await db.query(
    'INSERT INTO contas (nome, tipo, saldo_inicial, saldo_atual) VALUES ($1, $2, $3, $3) RETURNING *',
    [nome, tipo, saldo_inicial]
  );

  res.status(201).json(result.rows[0]);
}

export async function atualizarConta(req, res) {
  const { id } = req.params;
  const { nome, tipo, saldo_atual } = req.body;

  const result = await db.query(
    'UPDATE contas SET nome=$1, tipo=$2, saldo_atual=$3 WHERE id=$4 RETURNING *',
    [nome, tipo, saldo_atual, id]
  );

  res.json(result.rows[0]);
}

export async function excluirConta(req, res) {
  const { id } = req.params;

  const usado = await db.query(
    `SELECT id FROM pagar WHERE conta_id=$1 UNION SELECT id FROM receber WHERE conta_id=$1 UNION SELECT id FROM historico WHERE conta_id=$1`,
    [id]
  );

  if (usado.rows.length > 0) {
    return res.status(400).json({ error: 'Não é possível excluir conta com movimentações vinculadas.' });
  }

  await db.query('DELETE FROM contas WHERE id=$1', [id]);
  res.json({ message: 'Conta excluída com sucesso.' });
}
