import { Router } from "express";
import { getRol } from "../controllers/rolController.js";
const router = Router();

router.get("/rol/", (getRol));

export default router;