import { Router } from 'express';
import { obterResumo } from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/', obterResumo);

export default router;
