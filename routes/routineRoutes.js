import express from "express";
import { getRoutines,createRoutine } from "../controllers/routine.js";

const router = express.Router();

router.get("/get", getRoutines);
router.post("/create", createRoutine);

export default router;