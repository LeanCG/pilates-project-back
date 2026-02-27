import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController.js";

const router = Router();

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Obtener métricas del dashboard
 *     description: Retorna estadísticas clave como total de clientes, clientes activos, rutinas e ingresos del mes.
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Métricas del estudio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardStats'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/dashboard", getDashboard);

export default router;