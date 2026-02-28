import express from "express";
import { getFacturas, handleTransaction } from "../controllers/accounting.js";
const router = express.Router();
/**
 * @swagger
 * /api/accounting/movement:
 *   post:
 *     summary: Registrar un nuevo movimiento de caja
 *     tags: [Accounting]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionRequest'
 *     responses:
 *       201:
 *         description: Movimiento registrado exitosamente
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/movement', handleTransaction);
/**
 * @swagger
 * /api/accounting/balance:
 *   get:
 *     summary: Obtener todos los movimientos de caja (ingresos y egresos)
 *     tags: [Accounting]
 *     responses:
 *       200:
 *         description: Lista de movimientos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movement'
 *       500:
 *         description: Error interno del servidor
 */
router.get('/balance', getFacturas);
export default router;
