import { db } from "../connect.js";
import util from 'util';
import bcrypt from "bcryptjs";
import { validateRegisterEdit } from "../middlewares/validate_edit.js";
import { calcularDescuento } from "../middlewares/descuento.js";
import { validateRegister } from "../middlewares/validate.js";
import { UserModel } from "../models/user.model.js";
const query = util.promisify(db.query).bind(db);
/**
 * Logically deletes a user by setting their state to 2 (inactive).
 * @param req - Express request object with user ID in params.
 * @param res - Express response object.
 */
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await UserModel.updateState(Number(id), 2);
        res.status(200).json("Usuario borrado");
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
/**
 * Creates a new user with full details (address, persona, auth, turn, invoice).
 * Validates existence of DNI and encrypts the password.
 * @param req - Express request object with user creation data.
 * @param res - Express response object.
 */
export const createUser = [validateRegister, async (req, res) => {
        try {
            const dniExists = await UserModel.findByDni(req.body.dni);
            if (dniExists.length) {
                return res.status(409).json("Usuario existente");
            }
            const salt = bcrypt.genSaltSync(10);
            const encrypt_password = bcrypt.hashSync(req.body.password, salt);
            let precio = req.body.precio;
            if (Number(req.body.descuento) > 0) {
                precio = calcularDescuento(req.body.precio, req.body.descuento);
            }
            await UserModel.createCompleteUser(req.body, encrypt_password, precio);
            res.status(201).json({ message: "Usuario creado satisfactoriamente." });
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }];
/**
 * Updates an existing user's persona and account details.
 * @param req - Express request object with persona ID in params and update data in body.
 * @param res - Express response object.
 */
export const editUser = [validateRegisterEdit, async (req, res) => {
        try {
            const { id } = req.params;
            const salt = bcrypt.genSaltSync(10);
            const encrypt_password = bcrypt.hashSync(req.body.password, salt);
            const editPersona = {
                apellido: req.body.apellido, nombre: req.body.nombre,
                dni: req.body.dni, cuil: req.body.cuil,
                direccion_id: req.body.direccion_id, tipo_persona_id: req.body.tipo_persona_id
            };
            const editUsuario = {
                username: req.body.username, password: encrypt_password,
                created_at: req.body.created_at, updated_at: req.body.updated_at,
                rol_id: req.body.rol_id, tipo_estado_id: req.body.tipo_estado_id
            };
            const existingUser = await UserModel.findByUsernameExcludingId(req.body.username, Number(id));
            if (existingUser.length) {
                return res.status(409).json("Nombre en uso");
            }
            await UserModel.updateUser(Number(id), editPersona, editUsuario);
            res.status(200).json("Usuario actualizado correctamente");
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }];
/**
 * Partially updates an existing user (e.g., from a profile settings page).
 * @param req - Express request object with persona ID in params and partial update data in body.
 * @param res - Express response object.
 */
export const editUsuario = [validateRegisterEdit, async (req, res) => {
        try {
            const { id } = req.params;
            const today = new Date();
            const updated_at = today.toISOString().split('T')[0]; // YYYY-MM-DD
            let { apellido, nombre, dni, cuil, username } = req.body;
            const editPersona = { apellido, nombre, dni, cuil };
            const editUsuario = { username, updated_at };
            const existingUser = await UserModel.findByUsernameExcludingId(username, Number(id));
            if (existingUser.length) {
                return res.status(409).json("Nombre en uso");
            }
            await UserModel.updateUsuarioPartial(Number(id), editPersona, editUsuario);
            res.status(200).json("Usuario actualizado correctamente");
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }];
/**
 * Retrieves a list of all users with simplified data (for listing tables).
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const listUsers = async (req, res) => {
    try {
        const data = await UserModel.listUsers();
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
/**
 * Retrieves full information for a specific user persona.
 * @param req - Express request object with persona ID in params.
 * @param res - Express response object.
 */
export const infoUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = await UserModel.infoUser(Number(userId));
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
