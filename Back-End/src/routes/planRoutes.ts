import express from "express";
import { getPlans, getPlanById } from "../controllers/planController.js";

const router = express.Router();

/**
 * @swagger
 * /api/plans:
 *   get:
 *     summary: Obtener todos los planes
 *     tags: [Plans]
 *     responses:
 *       200:
 *         description: Lista de planes disponibles
 */
router.get("/", getPlans);

/**
 * @swagger
 * /api/plans/{id}:
 *   get:
 *     summary: Obtener plan por ID
 *     tags: [Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Plan encontrado
 */
router.get("/:id", getPlanById);

export default router;
