import { Router } from 'express';
import { listarContas, criarConta, atualizarConta, excluirConta } from '../controllers/contas.controller.js';

const router = Router();

router.get('/', listarContas);
router.post('/', criarConta);
router.put('/:id', atualizarConta);
router.delete('/:id', excluirConta);

export default router;
