import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthModel } from "../models/auth.model.js";

// Usamos las variables de entorno para el secret, con fallback de desarrollo
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

/**
 * Authenticates a user and returns a stateless JWT token.
 * Verification includes username existence check and password comparison.
 * @param req - Express request object with credentials in body.
 * @param res - Express response object.
 */
export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { username, password } = req.body;

        const data: any = await AuthModel.findByUsernameForLogin(username);

        if (data.length === 0) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const user = data[0];
        const checkPassword = bcrypt.compareSync(password, user.password);

        if (!checkPassword) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const token = jwt.sign(
            { id: user.id, rol_id: user.rol_id, username: user.username },
            JWT_SECRET,
            { expiresIn: '8h' } // Specs indicated 8h
        );

        // Stateless JWT en body
        res.status(200).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                rol_id: user.rol_id
            }
        });

    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * Handles user logout by sending a success message.
 * (Actual token discarding is handled on the client-side).
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const logout = (req: express.Request, res: express.Response) => {
    // Para stateless JWT, el logout se maneja comúnmente en el cliente descartando el token
    // Aún así proveemos un endpoint para consistencia si se necesitara limpieza extra
    res.status(200).json({ message: "Logged out exitosamente" });
}