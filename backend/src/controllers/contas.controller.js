import { db } from "../database/db.js";
import bcrypt from "bcryptjs";

export async function listarContas(req, res) {
  const result = await db.query(`
    SELECT id, nome, email, perfil, criado_em
    FROM usuarios
    ORDER BY id DESC
  `);

  res.json(result.rows);
}

export async function criarConta(req, res) {
  const { nome, email, senha, perfil = "comum" } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      error: "Nome, email e senha são obrigatórios."
    });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const result = await db.query(
    `
    INSERT INTO usuarios (nome, email, senha, perfil)
    VALUES ($1, $2, $3, $4)
    RETURNING id, nome, email, perfil, criado_em
    `,
    [nome, email, senhaHash, perfil]
  );

  res.status(201).json(result.rows[0]);
}

export async function atualizarConta(req, res) {
  const { id } = req.params;
  const { nome, email, senha, perfil = "comum" } = req.body;

  let result;

  if (senha) {
    const senhaHash = await bcrypt.hash(senha, 10);

    result = await db.query(
      `
      UPDATE usuarios
      SET nome = $1, email = $2, senha = $3, perfil = $4
      WHERE id = $5
      RETURNING id, nome, email, perfil, criado_em
      `,
      [nome, email, senhaHash, perfil, id]
    );
  } else {
    result = await db.query(
      `
      UPDATE usuarios
      SET nome = $1, email = $2, perfil = $3
      WHERE id = $4
      RETURNING id, nome, email, perfil, criado_em
      `,
      [nome, email, perfil, id]
    );
  }

  res.json(result.rows[0]);
}

export async function excluirConta(req, res) {
  const { id } = req.params;

  await db.query(
    `
    DELETE FROM usuarios
    WHERE id = $1
    `,
    [id]
  );

  res.json({
    message: "Usuário excluído com sucesso."
  });
}