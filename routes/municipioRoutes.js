import { Router } from "express";
import { getMunicipio } from "../controllers/municipioController.js";
const router= Router();

router.get("/municipio/", (getMunicipio));

export default router;