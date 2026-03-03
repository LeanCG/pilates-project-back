import express from "express";
import { getRoutines, createRoutine, deleteRoutine, updateRoutine, getRoutineId } from "../controllers/routine.js";
import { RoutineAssignController } from "../controllers/routineAssignController.js";
import { authenticate, authorize } from "../middlewares/auth.js";
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
router.get("/list", authenticate, getRoutines);
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
router.post("/create", authenticate, authorize("admin", "instructor"), createRoutine);
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
router.delete("/delete/:id", authenticate, authorize("admin", "instructor"), deleteRoutine);
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
router.put("/update/:id", authenticate, authorize("admin", "instructor"), updateRoutine);
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
router.get("/list/:id", authenticate, getRoutineId);
/**
 * @swagger
 * /api/routine/assign:
 *   post:
 *     summary: Asignar una rutina a un cliente
 *     tags: [Routines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente_id:
 *                 type: integer
 *               rutina_id:
 *                 type: integer
 *               observaciones:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rutina asignada exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.post("/assign", authenticate, authorize("admin", "instructor"), RoutineAssignController.assignRoutine);
/**
 * @swagger
 * /api/routine/my-routines:
 *   get:
 *     summary: Obtener las rutinas asignadas al cliente actual
 *     tags: [Routines]
 *     responses:
 *       200:
 *         description: Lista de rutinas asignadas
 *       500:
 *         description: Error interno del servidor
 */
router.get("/my-routines", authenticate, RoutineAssignController.getMyRoutines);
/**
 * @swagger
 * /api/routine/my-routines/active:
 *   get:
 *     summary: Obtener la rutina activa del cliente actual
 *     tags: [Routines]
 *     responses:
 *       200:
 *         description: Rutina activa
 *       500:
 *         description: Error interno del servidor
 */
router.get("/my-routines/active", authenticate, RoutineAssignController.getMyActiveRoutine);
/**
 * @swagger
 * /api/routine/assign/list:
 *   get:
 *     summary: Listar todas las asignaciones de rutinas
 *     tags: [Routines]
 *     responses:
 *       200:
 *         description: Lista de asignaciones
 *       500:
 *         description: Error interno del servidor
 */
router.get("/assign/list", authenticate, authorize("admin", "instructor"), RoutineAssignController.getAllAssignments);
/**
 * @swagger
 * /api/routine/assign/{id}/deactivate:
 *   put:
 *     summary: Desactivar una asignación de rutina
 *     tags: [Routines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Asignación desactivada
 *       500:
 *         description: Error interno del servidor
 */
router.put("/assign/:id/deactivate", authenticate, authorize("admin", "instructor"), RoutineAssignController.deactivateAssignment);
export default router;
