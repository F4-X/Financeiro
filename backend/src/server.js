import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { initDatabase } from "./database/init.js";

import contasRoutes from "./routes/contas.routes.js";
import pagarRoutes from "./routes/pagar.routes.js";
import receberRoutes from "./routes/receber.routes.js";
import historicoRoutes from "./routes/historico.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

const PORT = 3003;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

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
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});