import { Router } from 'express';
import { listarReceber, criarReceber, marcarComoRecebido, excluirReceber } from '../controllers/receber.controller.js';

const router = Router();

router.get('/', listarReceber);
router.post('/', criarReceber);
router.patch('/:id/receber', marcarComoRecebido);
router.delete('/:id', excluirReceber);

export default router;
