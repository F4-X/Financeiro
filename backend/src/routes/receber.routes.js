import { Router } from "express";

import {
  listarReceber,
  criarReceber,
  marcarComoRecebido,
  editarReceber,
  excluirReceber
} from "../controllers/receber.controller.js";

import { auth } from "../middlewares/auth.js";

const router = Router();

router.get("/", auth, listarReceber);
router.post("/", auth, criarReceber);
router.put("/:id", auth, editarReceber);
router.patch("/:id/receber", auth, marcarComoRecebido);
router.delete("/:id", auth, excluirReceber);

export default router;