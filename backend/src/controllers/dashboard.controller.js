import { db } from '../database/db.js';

export async function obterResumo(req, res) {
  const contas = await db.query('SELECT COALESCE(SUM(saldo_atual), 0) AS saldo FROM contas');
  const pagar = await db.query("SELECT COALESCE(SUM(valor), 0) AS total FROM pagar WHERE status='pendente'");
  const receber = await db.query("SELECT COALESCE(SUM(valor), 0) AS total FROM receber WHERE status='pendente'");

  res.json({
    saldo_total: Number(contas.rows[0].saldo),
    total_pagar: Number(pagar.rows[0].total),
    total_receber: Number(receber.rows[0].total)
  });
}
