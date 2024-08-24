import { db } from "../connect.js"
import bcrypt from "bcryptjs"
import util from 'util'

import jwt from "jsonwebtoken"

// Convertir db.query a una función que devuelve una Promesa
const query = util.promisify(db.query).bind(db)

export const login = async (req, res) => {
        try {
            const q = "SELECT * FROM user WHERE username = ?"

            const data = await query(q, [req.body.username])

            if (data.length === 0) {
                return res.status(409).json("Usuario no existente")
            }

            console.log(data)
            console.log(data[0].username)

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