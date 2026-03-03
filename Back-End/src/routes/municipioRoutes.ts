import { Router } from "express";
import { getMunicipio } from "../controllers/municipioController.js";
const router = Router();

/**
 * @swagger
 * /api/municipio:
 *   get:
 *     summary: Obtener la lista de municipios
 *     tags: [Catalogs]
 *     responses:
 *       200:
 *         description: Lista de municipios disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *       500:
 *         description: Error interno del servidor
 */
router.get("/municipio/", (getMunicipio));

export default router;