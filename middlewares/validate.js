import {body, validationResult} from 'express-validator'

export const validateRegister = [
    body('username').isLength({ min: 4 }).withMessage('El nombre de usuario debe tener al menos 4 caracteres.'),
    // body('email').isEmail().withMessage('Email no válido.'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        console.log("error en el validador");
        next()
    }
]