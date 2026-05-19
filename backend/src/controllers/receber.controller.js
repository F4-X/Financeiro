import { db } from '../database/db.js';

export async function listarReceber(req, res) {
  const result = await db.query(`
    SELECT r.*, c.nome AS conta_nome
    FROM receber r
    LEFT JOIN contas c ON c.id = r.conta_id
    ORDER BY r.vencimento ASC
  `);
  res.json(result.rows);
}

export async function criarReceber(req, res) {
  const { descricao, valor, vencimento, conta_id, observacao } = req.body;

  if (!descricao || !valor || !vencimento || !conta_id) {
    return res.status(400).json({ error: 'Descrição, valor, vencimento e conta são obrigatórios.' });
  }

  const result = await db.query(
    `INSERT INTO receber (descricao, valor, vencimento, conta_id, observacao)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [descricao, valor, vencimento, conta_id, observacao || null]
  );

  res.status(201).json(result.rows[0]);
}

export async function marcarComoRecebido(req, res) {
  const { id } = req.params;

  const busca = await db.query('SELECT * FROM receber WHERE id=$1', [id]);
  const item = busca.rows[0];

  if (!item) return res.status(404).json({ error: 'Conta a receber não encontrada.' });
  if (item.status === 'recebido') return res.status(400).json({ error: 'Este valor já foi recebido.' });

  await db.query('UPDATE receber SET status=$1 WHERE id=$2', ['recebido', id]);
  await db.query('UPDATE contas SET saldo_atual = saldo_atual + $1 WHERE id=$2', [item.valor, item.conta_id]);
  await db.query(
    `INSERT INTO historico (tipo, descricao, valor, conta_id, origem_id)
     VALUES ('receber', $1, $2, $3, $4)`,
    [item.descricao, item.valor, item.conta_id, item.id]
  );

  res.json({ message: 'Valor marcado como recebido.' });
}

export async function excluirReceber(req, res) {
  const { id } = req.params;
  await db.query('DELETE FROM receber WHERE id=$1 AND status=$2', [id, 'pendente']);
  res.json({ message: 'Conta a receber excluída.' });
}
