import express from "express";
import {getExcercises,createExcercise} from "../controllers/exercise.js";

const router = express.Router();

router.get("/exercise",(getExcercises));
router.post("/create",(createExcercise));



export default router;