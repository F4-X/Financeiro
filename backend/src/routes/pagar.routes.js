import { Router } from 'express';
import { listarPagar, criarPagar, marcarComoPago, excluirPagar } from '../controllers/pagar.controller.js';

const router = Router();

router.get('/', listarPagar);
router.post('/', criarPagar);
router.patch('/:id/pagar', marcarComoPago);
router.delete('/:id', excluirPagar);

export default router;
