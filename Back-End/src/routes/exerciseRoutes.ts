import express from "express";
import { getExcercises, createExcercise, deleteExcercise, updateExcercise } from "../controllers/exercise.js";

const router = express.Router();

/**
 * @swagger
 * /api/exercise/exercise:
 *   get:
 *     summary: Obtener el catálogo completo de ejercicios
 *     tags: [Exercises]
 *     responses:
 *       200:
 *         description: Lista de ejercicios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exercise'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/exercise", (getExcercises));

/**
 * @swagger
 * /api/exercise/create:
 *   post:
 *     summary: Crear un nuevo ejercicio
 *     tags: [Exercises]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [descripcion]
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: "Hundred"
 *     responses:
 *       201:
 *         description: Ejercicio creado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/create", (createExcercise));

/**
 * @swagger
 * /api/exercise/delete/{id}:
 *   delete:
 *     summary: Eliminar un ejercicio por ID
 *     tags: [Exercises]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del ejercicio
 *     responses:
 *       200:
 *         description: Ejercicio eliminado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/delete/:id", (deleteExcercise));

/**
 * @swagger
 * /api/exercise/update/{id}:
 *   put:
 *     summary: Actualizar un ejercicio existente
 *     tags: [Exercises]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del ejercicio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: "Roll Up"
 *     responses:
 *       200:
 *         description: Ejercicio actualizado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/update/:id", (updateExcercise));

export default router;