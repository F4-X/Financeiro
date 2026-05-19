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
  const {
    descricao,
    valor,
    vencimento,
    observacao,
    itens = []
  } = req.body;

  const result = await db.query(
    `
    INSERT INTO pagar (
      usuario_id,
      descricao,
      valor,
      vencimento,
      observacao,
      itens,
      valor_pago
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

export async function marcarComoPago(req, res) {
  const usuarioId = req.usuario.id;
  const { id } = req.params;
  const { valor } = req.body;

  const valorParcial = Number(valor || 0);

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

  const total = Number(item.valor || 0);
  const pagoAtual = Number(item.valor_pago || 0);
  const novoPago = pagoAtual + valorParcial;

  let novoStatus = "pendente";

  if (novoPago >= total && total > 0) {
    novoStatus = "pago";
  } else if (novoPago > 0) {
    novoStatus = "parcial";
  }

  const result = await db.query(
    `
    UPDATE pagar
    SET
      valor_pago = $1,
      status = $2
    WHERE id = $3
    AND usuario_id = $4
    RETURNING *
    `,
    [
      novoPago,
      novoStatus,
      id,
      usuarioId
    ]
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
      item.descricao || "Pagamento parcial",
      valorParcial
    ]
  );

  res.json(result.rows[0]);
}

export async function editarPagar(req, res) {
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
    UPDATE pagar
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