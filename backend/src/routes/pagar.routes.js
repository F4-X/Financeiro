import { Router } from "express";
import multer from "multer";

import {
  listarPagar,
  criarPagar,
  marcarComoPago,
  editarPagar,
  excluirPagar
} from "../controllers/pagar.controller.js";

import { auth } from "../middlewares/auth.js";

const router = Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const nomeArquivo = Date.now() + "-" + file.originalname;
    cb(null, nomeArquivo);
  }
});

const upload = multer({ storage });

router.get("/", auth, listarPagar);
router.post("/", auth, upload.single("arquivo"), criarPagar);
router.put("/:id", auth, upload.single("arquivo"), editarPagar);
router.patch("/:id/pagar", auth, marcarComoPago);
router.delete("/:id", auth, excluirPagar);

export default router;