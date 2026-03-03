import { body, validationResult } from 'express-validator';
import express from 'express';

export const validateRegister = [
    body('username').isLength({ min: 4 }).withMessage('El nombre de usuario debe tener al menos 4 caracteres.'),
    // body('email').isEmail().withMessage('Email no válido.'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next()
    }
];