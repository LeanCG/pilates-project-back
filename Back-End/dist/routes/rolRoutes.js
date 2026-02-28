import { Router } from "express";
import { getRol } from "../controllers/rolController.js";
const router = Router();
/**
 * @swagger
 * /api/users/rol:
 *   get:
 *     summary: Obtener la lista de roles de usuario
 *     tags: [Catalogs]
 *     responses:
 *       200:
 *         description: Lista de roles disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   descripcion:
 *                     type: string
 *       500:
 *         description: Error interno del servidor
 */
router.get("/rol/", (getRol));
export default router;
