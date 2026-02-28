import express from "express";
import { getRoutines, createRoutine, deleteRoutine, updateRoutine, getRoutineId } from "../controllers/routine.js";

const router = express.Router();

/**
 * @swagger
 * /api/routine/list:
 *   get:
 *     summary: Obtener todas las rutinas
 *     tags: [Routines]
 *     responses:
 *       200:
 *         description: Lista de rutinas con sus ejercicios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Routine'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/list", getRoutines);

/**
 * @swagger
 * /api/routine/create:
 *   post:
 *     summary: Crear una nueva rutina con ejercicios
 *     tags: [Routines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoutineRequest'
 *     responses:
 *       201:
 *         description: Rutina creada exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.post("/create", createRoutine);

/**
 * @swagger
 * /api/routine/delete/{id}:
 *   delete:
 *     summary: Eliminar una rutina y sus ejercicios asociados
 *     tags: [Routines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la rutina
 *     responses:
 *       200:
 *         description: Rutina eliminada
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/delete/:id", deleteRoutine);

/**
 * @swagger
 * /api/routine/update/{id}:
 *   put:
 *     summary: Actualizar una rutina existente y sus ejercicios
 *     tags: [Routines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la rutina
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoutineRequest'
 *     responses:
 *       200:
 *         description: Rutina actualizada
 *       500:
 *         description: Error interno del servidor
 */
router.put("/update/:id", updateRoutine);

/**
 * @swagger
 * /api/routine/list/{id}:
 *   get:
 *     summary: Obtener una rutina específica por ID
 *     tags: [Routines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la rutina
 *     responses:
 *       200:
 *         description: Detalle de la rutina con sus ejercicios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Routine'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/list/:id", getRoutineId);

export default router;