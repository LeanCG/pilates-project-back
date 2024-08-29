import express from "express";
import {getExcercises,createExcercise,deleteExcercise} from "../controllers/exercise.js";

const router = express.Router();

router.get("/exercise",(getExcercises));
router.post("/create",(createExcercise));
router.delete("/delete/:id",(deleteExcercise));



export default router;