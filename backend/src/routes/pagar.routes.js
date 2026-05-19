import { Router } from "express";

import {
  listarPagar,
  criarPagar,
  marcarComoPago,
  excluirPagar
} from "../controllers/pagar.controller.js";

import { auth } from "../middlewares/auth.js";

const router = Router();

router.get("/", auth, listarPagar);

router.post("/", auth, criarPagar);

router.patch(
  "/:id/pagar",
  auth,
  marcarComoPago
);

router.delete(
  "/:id",
  auth,
  excluirPagar
);

export default router;