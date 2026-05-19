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

  const result = await db.query(
    `
    INSERT INTO receber (
      usuario_id,
      descricao,
      valor,
      vencimento,
      observacao,
      itens,
      valor_recebido
    )
    VALUES ($1, $2, $3, $4, $5, $6, 0)
    RETURNING *
    `,
    [
      usuarioId,
      descricao || "",
      Number(valor || 0),
      vencimento || null,
      observacao || null,
      JSON.stringify(itens)
    ]
  );

  res.status(201).json(result.rows[0]);
}

export async function marcarComoRecebido(req, res) {
  const usuarioId = req.usuario.id;
  const { id } = req.params;
  const { valor } = req.body;

  const valorParcial = Number(valor || 0);

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

  const total = Number(item.valor || 0);
  const recebidoAtual = Number(item.valor_recebido || 0);
  const novoRecebido = Math.min(recebidoAtual + valorParcial, total);

  let novoStatus = "pendente";

  if (novoRecebido >= total && total > 0) {
    novoStatus = "recebido";
  } else if (novoRecebido > 0) {
    novoStatus = "parcial";
  }

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
      item.descricao || "Recebimento",
      valorParcial
    ]
  );

  if (novoStatus === "recebido") {
    await db.query(
      `
      DELETE FROM receber
      WHERE id = $1
      AND usuario_id = $2
      `,
      [id, usuarioId]
    );

    return res.json({
      message: "Conta recebida e enviada para o histórico."
    });
  }

  const result = await db.query(
    `
    UPDATE receber
    SET
      valor_recebido = $1,
      status = $2
    WHERE id = $3
    AND usuario_id = $4
    RETURNING *
    `,
    [novoRecebido, novoStatus, id, usuarioId]
  );

  res.json(result.rows[0]);
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
      descricao || "",
      Number(valor || 0),
      vencimento || null,
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

  const result = await db.query(
    `
    DELETE FROM receber
    WHERE id = $1
    AND usuario_id = $2
    RETURNING *
    `,
    [id, usuarioId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: "Conta a receber não encontrada."
    });
  }

  res.json({
    message: "Conta a receber excluída."
  });
}