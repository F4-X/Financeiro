import { db } from "../database/db.js";

function arquivoUrl(req) {
  if (!req.file) return null;

  return `/uploads/${req.file.filename}`;
}

function tratarItens(itens) {
  if (!itens) return [];

  if (typeof itens === "string") {
    try {
      return JSON.parse(itens);
    } catch {
      return [];
    }
  }

  return itens;
}

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
    observacao
  } = req.body;

  const itens = tratarItens(req.body.itens);
  const arquivo = arquivoUrl(req);

  const result = await db.query(
    `
    INSERT INTO pagar (
      usuario_id,
      descricao,
      valor,
      vencimento,
      observacao,
      itens,
      valor_pago,
      arquivo_url
    )
    VALUES ($1, $2, $3, $4, $5, $6, 0, $7)
    RETURNING *
    `,
    [
      usuarioId,
      descricao || "",
      Number(valor || 0),
      vencimento || null,
      observacao || null,
      JSON.stringify(itens),
      arquivo
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
  const novoPago = Math.min(pagoAtual + valorParcial, total);

  let novoStatus = "pendente";

  if (novoPago >= total && total > 0) {
    novoStatus = "pago";
  } else if (novoPago > 0) {
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
    VALUES ($1, 'pagar', $2, $3)
    `,
    [
      usuarioId,
      item.descricao || "Pagamento",
      valorParcial
    ]
  );

  if (novoStatus === "pago") {
    await db.query(
      `
      DELETE FROM pagar
      WHERE id = $1
      AND usuario_id = $2
      `,
      [id, usuarioId]
    );

    return res.json({
      message: "Conta paga e enviada para o histórico."
    });
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
    [novoPago, novoStatus, id, usuarioId]
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
    observacao
  } = req.body;

  const itens = tratarItens(req.body.itens);
  const arquivo = arquivoUrl(req);

  const result = await db.query(
    `
    UPDATE pagar
    SET
      descricao = $1,
      valor = $2,
      vencimento = $3,
      observacao = $4,
      itens = $5,
      arquivo_url = COALESCE($6, arquivo_url)
    WHERE id = $7
    AND usuario_id = $8
    RETURNING *
    `,
    [
      descricao || "",
      Number(valor || 0),
      vencimento || null,
      observacao || null,
      JSON.stringify(itens),
      arquivo,
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

  const result = await db.query(
    `
    DELETE FROM pagar
    WHERE id = $1
    AND usuario_id = $2
    RETURNING *
    `,
    [id, usuarioId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      error: "Conta a pagar não encontrada."
    });
  }

  res.json({
    message: "Conta a pagar excluída."
  });
}