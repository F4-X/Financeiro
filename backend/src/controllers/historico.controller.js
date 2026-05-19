import { db } from '../database/db.js';

export async function listarHistorico(req, res) {
  const result = await db.query(`
    SELECT h.*, c.nome AS conta_nome
    FROM historico h
    LEFT JOIN contas c ON c.id = h.conta_id
    ORDER BY h.data_movimento DESC
  `);
  res.json(result.rows);
}
