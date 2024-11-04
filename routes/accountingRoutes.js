import express from "express";
import { GetFacturaById, getFacturas, handleTransaction } from "../controllers/accounting.js";

const router = express.Router()

router.post('/movement', handleTransaction)
router.get('/balance', getFacturas)
router.get('/factura/:id', GetFacturaById)

export default router