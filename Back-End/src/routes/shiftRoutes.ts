import express from "express";
import { getShifts, getShiftById, getAvailableShifts, createShift, updateShift, deleteShift } from "../controllers/shiftController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/shifts:
 *   get:
 *     summary: Obtener todos los turnos
 *     tags: [Shifts]
 *     parameters:
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *       - in: query
 *         name: instructor_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de turnos
 */
router.get("/", authenticate, getShifts);

/**
 * @swagger
 * /api/shifts/available:
 *   get:
 *     summary: Obtener turnos disponibles
 *     tags: [Shifts]
 *     parameters:
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de turnos disponibles
 */
router.get("/available", authenticate, getAvailableShifts);

/**
 * @swagger
 * /api/shifts/{id}:
 *   get:
 *     summary: Obtener turno por ID
 *     tags: [Shifts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno encontrado
 */
router.get("/:id", authenticate, getShiftById);

/**
 * @swagger
 * /api/shifts:
 *   post:
 *     summary: Crear nuevo turno
 *     tags: [Shifts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *               hora:
 *                 type: string
 *               instructor_id:
 *                 type: integer
 *               actividad:
 *                 type: string
 *     responses:
 *       201:
 *         description: Turno creado
 */
router.post("/", authenticate, authorize("admin", "instructor"), createShift);

/**
 * @swagger
 * /api/shifts/{id}:
 *   put:
 *     summary: Actualizar turno
 *     tags: [Shifts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno actualizado
 */
router.put("/:id", authenticate, authorize("admin", "instructor"), updateShift);

/**
 * @swagger
 * /api/shifts/{id}:
 *   delete:
 *     summary: Eliminar turno
 *     tags: [Shifts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Turno eliminado
 */
router.delete("/:id", authenticate, authorize("admin"), deleteShift);

export default router;
