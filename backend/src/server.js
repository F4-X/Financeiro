import express from "express";
import cors from "cors";

import { initDatabase } from "./database/init.js";

import contasRoutes from "./routes/contas.routes.js";
import pagarRoutes from "./routes/pagar.routes.js";
import receberRoutes from "./routes/receber.routes.js";
import historicoRoutes from "./routes/historico.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

const PORT = 3003;

app.use(cors({
  origin: [
    "https://meufinanceiro2.com",
    "https://www.meufinanceiro2.com",
    "http://localhost:5173"
  ],

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS"
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization"
  ]
}));

app.use(express.json());

app.use("/auth", authRoutes);

app.use("/contas", contasRoutes);
app.use("/pagar", pagarRoutes);
app.use("/receber", receberRoutes);
app.use("/historico", historicoRoutes);
app.use("/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API Financeiro online"
  });
});

await initDatabase();

app.listen(PORT, () => {
  console.log(
    `Servidor rodando em http://localhost:${PORT}`
  );
});