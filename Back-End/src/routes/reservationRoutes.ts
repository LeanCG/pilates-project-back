import express from "express";
import { getReservations, getReservationById, createReservation, confirmReservation, cancelReservation } from "../controllers/reservationController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Obtener todas las reservas
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cliente_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de reservas
 */
router.get("/", authenticate, getReservations);

/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     summary: Obtener reserva por ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva encontrada
 */
router.get("/:id", authenticate, getReservationById);

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Crear nueva reserva
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               turno_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Reserva creada
 *       400:
 *         description: Error de validación
 */
router.post("/", authenticate, createReservation);

/**
 * @swagger
 * /api/reservations/{id}/confirm:
 *   put:
 *     summary: Confirmar asistencia a reserva
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Asistencia confirmada
 */
router.put("/:id/confirm", authenticate, confirmReservation);

/**
 * @swagger
 * /api/reservations/{id}/cancel:
 *   put:
 *     summary: Cancelar reserva
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               motivo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reserva cancelada
 */
router.put("/:id/cancel", authenticate, cancelReservation);

export default router;
