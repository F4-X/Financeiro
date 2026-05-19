import { Router } from 'express';
import { listarHistorico } from '../controllers/historico.controller.js';

const router = Router();

router.get('/', listarHistorico);

export default router;
