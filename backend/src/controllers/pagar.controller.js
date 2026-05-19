import { db } from "../database/db.js";

export async function listarPagar(req, res) {
  const usuarioId = req.usuario.id;

  const result = await db.query(
    `
    SELECT *
    FROM pagar
    WHERE usuario_id = $1
    ORDER BY vencimento ASC
    `,
    [usuarioId]
  );

  res.json(result.rows);
}

export async function criarPagar(req, res) {
  const usuarioId = req.usuario.id;
  const { descricao, valor, vencimento, observacao } = req.body;

  if (!descricao || !valor || !vencimento) {
    return res.status(400).json({
      error: "Descrição, valor e vencimento são obrigatórios."
    });
  }

  const result = await db.query(
    `
    INSERT INTO pagar (
      usuario_id,
      descricao,
      valor,
      vencimento,
      observacao
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [
      usuarioId,
      descricao,
      valor,
      vencimento,
      observacao || null
    ]
  );

  res.status(201).json(result.rows[0]);
}

export async function marcarComoPago(req, res) {
  const usuarioId = req.usuario.id;
  const { id } = req.params;

  const busca = await db.query(
    `
    SELECT *
    FROM pagar
    WHERE id = $1
    AND usuario_id = $2
    `,
    [id, usuarioId]
  );

  const item = busca.rows[0];

  if (!item) {
    return res.status(404).json({
      error: "Conta a pagar não encontrada."
    });
  }

  if (item.status === "pago") {
    return res.status(400).json({
      error: "Esta conta já foi paga."
    });
  }

  await db.query(
    `
    UPDATE pagar
    SET status = 'pago'
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
    VALUES ($1, 'pagar', $2, $3)
    `,
    [
      usuarioId,
      item.descricao,
      item.valor
    ]
  );

  res.json({
    message: "Conta marcada como paga."
  });
}

export async function editarPagar(req, res) {
  const usuarioId = req.usuario.id;
  const { id } = req.params;

  const {
    descricao,
    valor,
    vencimento,
    observacao
  } = req.body;

  if (!descricao || !valor || !vencimento) {
    return res.status(400).json({
      error: "Descrição, valor e vencimento são obrigatórios."
    });
  }

  const result = await db.query(
    `
    UPDATE pagar
    SET
      descricao = $1,
      valor = $2,
      vencimento = $3,
      observacao = $4
    WHERE id = $5
    AND usuario_id = $6
    RETURNING *
    `,
    [
      descricao,
      valor,
      vencimento,
      observacao || null,
      id,
      usuarioId
    ]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: "Conta a pagar não encontrada."
    });
  }

  res.json(result.rows[0]);
}

export async function excluirPagar(req, res) {
  const usuarioId = req.usuario.id;
  const { id } = req.params;

  await db.query(
    `
    DELETE FROM pagar
    WHERE id = $1
    AND usuario_id = $2
    AND status = 'pendente'
    `,
    [id, usuarioId]
  );

  res.json({
    message: "Conta a pagar excluída."
  });
}