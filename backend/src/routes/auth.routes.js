import { Router } from "express";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  if (
    email === "admin@financeiro.com" &&
    senha === "123456"
  ) {
    return res.json({
      token: "token-admin",
      usuario: {
        id: 1,
        nome: "Administrador",
        email
      }
    });
  }

  res.status(401).json({
    error: "Email ou senha inválidos"
  });
});

export default router;