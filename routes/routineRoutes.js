import express from "express";
import { getRoutines,createRoutine, deleteRoutine } from "../controllers/routine.js";

const router = express.Router();

router.get("/get", getRoutines);
router.post("/create", createRoutine);
router.delete("/delete/:id", deleteRoutine)

export default router;