import { db } from '../database/db.js';

export async function listarPagar(req, res) {
  const result = await db.query(`
    SELECT p.*, c.nome AS conta_nome
    FROM pagar p
    LEFT JOIN contas c ON c.id = p.conta_id
    ORDER BY p.vencimento ASC
  `);
  res.json(result.rows);
}

export async function criarPagar(req, res) {
  const { descricao, valor, vencimento, conta_id, observacao } = req.body;

  if (!descricao || !valor || !vencimento || !conta_id) {
    return res.status(400).json({ error: 'Descrição, valor, vencimento e conta são obrigatórios.' });
  }

  const result = await db.query(
    `INSERT INTO pagar (descricao, valor, vencimento, conta_id, observacao)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [descricao, valor, vencimento, conta_id, observacao || null]
  );

  res.status(201).json(result.rows[0]);
}

export async function marcarComoPago(req, res) {
  const { id } = req.params;

  const busca = await db.query('SELECT * FROM pagar WHERE id=$1', [id]);
  const item = busca.rows[0];

  if (!item) return res.status(404).json({ error: 'Conta a pagar não encontrada.' });
  if (item.status === 'pago') return res.status(400).json({ error: 'Esta conta já foi paga.' });

  await db.query('UPDATE pagar SET status=$1 WHERE id=$2', ['pago', id]);
  await db.query('UPDATE contas SET saldo_atual = saldo_atual - $1 WHERE id=$2', [item.valor, item.conta_id]);
  await db.query(
    `INSERT INTO historico (tipo, descricao, valor, conta_id, origem_id)
     VALUES ('pagar', $1, $2, $3, $4)`,
    [item.descricao, item.valor, item.conta_id, item.id]
  );

  res.json({ message: 'Conta marcada como paga.' });
}

export async function excluirPagar(req, res) {
  const { id } = req.params;
  await db.query('DELETE FROM pagar WHERE id=$1 AND status=$2', [id, 'pendente']);
  res.json({ message: 'Conta a pagar excluída.' });
}
