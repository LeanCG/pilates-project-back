import express from "express";
import { getRoutines } from "../controllers/routine.js";

const router = express.Router();

router.get("/routines", getRoutines);

export default router;