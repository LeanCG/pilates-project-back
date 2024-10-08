import express from "express";
import { handleTransaction } from "../controllers/accounting.js";

const router = express.Router()

router.post('/movement', handleTransaction)

export default router