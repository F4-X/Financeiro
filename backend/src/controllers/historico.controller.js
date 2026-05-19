import { db } from "../database/db.js";

export async function listarHistorico(req, res) {
  const usuarioId = req.usuario.id;

  const result = await db.query(
    `
    SELECT *
    FROM historico
    WHERE usuario_id = $1
    ORDER BY data_movimento DESC
    `,
    [usuarioId]
  );

  res.json(result.rows);
}