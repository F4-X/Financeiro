import express from 'express';
import cors from 'cors';
import { initDatabase } from './database/init.js';
import contasRoutes from './routes/contas.routes.js';
import pagarRoutes from './routes/pagar.routes.js';
import receberRoutes from './routes/receber.routes.js';
import historicoRoutes from './routes/historico.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/contas', contasRoutes);
app.use('/pagar', pagarRoutes);
app.use('/receber', receberRoutes);
app.use('/historico', historicoRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API de Financas rodando' });
});

await initDatabase();

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
