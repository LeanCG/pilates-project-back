import { db } from "../connect.js"
import bcrypt from "bcryptjs"
import { body, validationResult } from 'express-validator'
import util from 'util'

import jwt from "jsonwebtoken"

// Convertir db.query a una función que devuelve una Promesa
const query = util.promisify(db.query).bind(db)

// Middleware de validación
const validateRegister = [
    body('username').isLength({ min: 4 }).withMessage('El nombre de usuario debe tener al menos 4 caracteres.'),
    body('email').isEmail().withMessage('Email no válido.'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next()
    }
]

export const register = [
    validateRegister,
    async (req, res) => {
        try {
            // Verificar si el usuario ya existe
            const q = "SELECT * FROM user WHERE username = ?"
            const data = await query(q, [req.body.username])

            if (data.length) {
                return res.status(409).json("Usuario existente")
            }

            // Encriptar la contraseña
            const salt = bcrypt.genSaltSync(10)
            const encrypt = bcrypt.hashSync(req.body.password, salt)

            // Insertar el nuevo usuario
            const q2 = "INSERT INTO user (`name`, `email`, `password`, `username`) VALUES (?)"
            const values = [req.body.name, req.body.email, encrypt, req.body.username]
            await query(q2, [values])

            res.status(200).json("Usuario creado")
        } catch (err) {
            res.status(500).json(err)
        }
    }
]


export const login = async (req, res) => {
        try {
            const q = "SELECT * FROM user WHERE username = ?"

            const data = await query(q, [req.body.username])

            if (data.length === 0) {
                return res.status(409).json("Usuario no existente")
            }

            const checkPassword = bcrypt.compareSync(req.body.password, data[0].password)

            if (!checkPassword){
                return res.status(400).json("Contraseña o usuario incorrecto")
            }

            const token = jwt.sign({id : data[0].id}, "secretkey")

            const {password, ...others} = data[0]

            res.cookie("accessToken", token, {
                httpOnly : true,
            }).status(200).json(others)
            
        }
        catch (error) {
            res.status(500).json(error)    
        }
}

export const logout = (req, res) => {
    res.clearCookie("acessToken", {
        secure: true,
        sameSite:"none"
    }).status(200).json("User has been log out")
}