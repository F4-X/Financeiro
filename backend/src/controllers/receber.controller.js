import { db } from "../database/db.js";

export async function listarReceber(req, res) {
  const usuarioId = req.usuario.id;

  const result = await db.query(
    `
    SELECT *
    FROM receber
    WHERE usuario_id = $1
    ORDER BY vencimento ASC
    `,
    [usuarioId]
  );

  res.json(result.rows);
}

export async function criarReceber(req, res) {
  const usuarioId = req.usuario.id;
  const {
    descricao,
    valor,
    vencimento,
    observacao,
    itens = []
  } = req.body;

  if (!descricao || !valor || !vencimento) {
    return res.status(400).json({
      error: "Descrição, valor e vencimento são obrigatórios."
    });
  }

  const result = await db.query(
    `
    INSERT INTO receber (
      usuario_id,
      descricao,
      valor,
      vencimento,
      observacao,
      itens
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [
      usuarioId,
      descricao,
      valor,
      vencimento,
      observacao || null,
      JSON.stringify(itens)
    ]
  );

  res.status(201).json(result.rows[0]);
}

export async function marcarComoRecebido(req, res) {
  const usuarioId = req.usuario.id;
  const { id } = req.params;

  const busca = await db.query(
    `
    SELECT *
    FROM receber
    WHERE id = $1
    AND usuario_id = $2
    `,
    [id, usuarioId]
  );

  const item = busca.rows[0];

  if (!item) {
    return res.status(404).json({
      error: "Conta a receber não encontrada."
    });
  }

  if (item.status === "recebido") {
    return res.status(400).json({
      error: "Este valor já foi recebido."
    });
  }

  await db.query(
    `
    UPDATE receber
    SET status = 'recebido'
    WHERE id = $1
    AND usuario_id = $2
    `,
    [id, usuarioId]
  );

  await db.query(
    `
    INSERT INTO historico (
      usuario_id,
      tipo,
      descricao,
      valor
    )
    VALUES ($1, 'receber', $2, $3)
    `,
    [
      usuarioId,
      item.descricao,
      item.valor
    ]
  );

  res.json({
    message: "Valor marcado como recebido."
  });
}

export async function editarReceber(req, res) {
  const usuarioId = req.usuario.id;
  const { id } = req.params;

  const {
    descricao,
    valor,
    vencimento,
    observacao,
    itens = []
  } = req.body;

  if (!descricao || !valor || !vencimento) {
    return res.status(400).json({
      error: "Descrição, valor e vencimento são obrigatórios."
    });
  }

  const result = await db.query(
    `
    UPDATE receber
    SET
      descricao = $1,
      valor = $2,
      vencimento = $3,
      observacao = $4,
      itens = $5
    WHERE id = $6
    AND usuario_id = $7
    RETURNING *
    `,
    [
      descricao,
      valor,
      vencimento,
      observacao || null,
      JSON.stringify(itens),
      id,
      usuarioId
    ]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: "Conta a receber não encontrada."
    });
  }

  res.json(result.rows[0]);
}

export async function excluirReceber(req, res) {
  const usuarioId = req.usuario.id;
  const { id } = req.params;

  await db.query(
    `
    DELETE FROM receber
    WHERE id = $1
    AND usuario_id = $2
    AND status = 'pendente'
    `,
    [id, usuarioId]
  );

  res.json({
    message: "Conta a receber excluída."
  });
}