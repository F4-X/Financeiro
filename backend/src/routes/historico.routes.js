import { Router } from "express";
import { listarHistorico } from "../controllers/historico.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.get("/", auth, listarHistorico);

export default router;