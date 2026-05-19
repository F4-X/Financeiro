import { db } from "../database/db.js";

export async function listarHistorico(req, res) {
  try {
    const result = await db.query(`
      SELECT *
      FROM historico
      ORDER BY data_movimento DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error("Erro ao listar histórico:", error);

    res.status(500).json({
      error: "Erro ao listar histórico."
    });
  }
}