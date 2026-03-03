import express from "express";
import { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee, getInstructors } from "../controllers/employeeController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Obtener todos los empleados
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: Lista de empleados
 */
router.get("/", authenticate, authorize("admin", "instructor"), getEmployees);

/**
 * @swagger
 * /api/employees/instructors:
 *   get:
 *     summary: Obtener instructores disponibles
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: Lista de instructores
 */
router.get("/instructors", authenticate, getInstructors);

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Obtener empleado por ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Empleado encontrado
 *       404:
 *         description: Empleado no encontrado
 */
router.get("/:id", authenticate, authorize("admin", "instructor"), getEmployeeById);

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Crear nuevo empleado
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               dni:
 *                 type: string
 *               cargo:
 *                 type: string
 *               fecha_contratacion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Empleado creado
 *       400:
 *         description: Error de validación
 */
router.post("/", authenticate, authorize("admin"), createEmployee);

/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     summary: Actualizar empleado
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Empleado actualizado
 */
router.put("/:id", authenticate, authorize("admin"), updateEmployee);

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: Eliminar (dar de baja) empleado
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Empleado dado de baja
 */
router.delete("/:id", authenticate, authorize("admin"), deleteEmployee);

export default router;
