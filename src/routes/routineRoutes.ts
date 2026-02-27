import express from "express";
import { getRoutines,createRoutine, deleteRoutine, updateRoutine, getRoutineId } from "../controllers/routine.js";

const router = express.Router();

router.get("/list", getRoutines);
router.post("/create", createRoutine);
router.delete("/delete/:id", deleteRoutine);
router.put("/update/:id", updateRoutine);
router.get("/list/:id", getRoutineId);

export default router;