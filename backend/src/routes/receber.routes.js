import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../database/db.js";

const router = Router();

const JWT_SECRET = "financeiro_secret";

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  const result = await db.query(
    `
    SELECT *
    FROM usuarios
    WHERE email = $1
    `,
    [email]
  );

  const usuario = result.rows[0];

  if (!usuario) {
    return res.status(401).json({
      error: "Email ou senha inválidos"
    });
  }

  const senhaCorreta = await bcrypt.compare(
    senha,
    usuario.senha
  );

  if (!senhaCorreta) {
    return res.status(401).json({
      error: "Email ou senha inválidos"
    });
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil
    },
    JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );

  res.json({
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil
    }
  });
});

export default router;