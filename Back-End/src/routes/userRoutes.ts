import express from "express";
import { createUser, deleteUser, editUser, editUsuario, infoUser, listUsers } from "../controllers/user.js";

/**
 * User data management routes.
 * Includes user creation, logical deletion, editing, listing, and detailed info.
 */
const router = express.Router();

/**
 * @swagger
 * /api/users/create:
 *   post:
 *     summary: Crear un nuevo usuario/cliente con todos sus datos
 *     description: Crea persona, usuario, turno y factura en una transacción.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       409:
 *         description: DNI o username ya existentes
 *       500:
 *         description: Error interno del servidor
 */
router.post("/create", ...createUser);

/**
 * @swagger
 * /api/users/delete/{id}:
 *   post:
 *     summary: Eliminar (lógicamente) un usuario
 *     description: Cambia el estado del usuario a 2 (inactivo) sin borrar registros.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario desactivado
 *       500:
 *         description: Error interno del servidor
 */
router.post("/delete/:id", deleteUser as express.RequestHandler);

/**
 * @swagger
 * /api/users/edit/{id}:
 *   post:
 *     summary: Editar datos completos de un usuario
 *     description: Actualiza persona y credenciales de un usuario existente.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la persona
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       409:
 *         description: Nombre de usuario en uso
 *       500:
 *         description: Error interno del servidor
 */
router.post("/edit/:id", ...editUser);

/**
 * @swagger
 * /api/users/editUser/{id}:
 *   post:
 *     summary: Edición parcial de un usuario (perfil)
 *     description: Actualiza solo nombre, apellido, DNI, CUIL y username.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la persona
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
 *               cuil:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       409:
 *         description: Nombre de usuario en uso
 *       500:
 *         description: Error interno del servidor
 */
router.post("/editUser/:id", ...editUsuario);

/**
 * @swagger
 * /api/users/list:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios con datos simplificados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/list", listUsers as express.RequestHandler);

/**
 * @swagger
 * /api/users/infoUser/{id}:
 *   get:
 *     summary: Obtener información detallada de un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la persona
 *     responses:
 *       200:
 *         description: Datos completos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/infoUser/:id", infoUser as express.RequestHandler);

export default router;