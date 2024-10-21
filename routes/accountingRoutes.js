import express from "express";
import { getFacturas, handleTransaction } from "../controllers/accounting.js";

const router = express.Router()

router.post('/movement', handleTransaction)
router.get('/balance', getFacturas)

export default router