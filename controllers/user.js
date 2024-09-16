import { db } from "../connect.js"
import util from 'util'
import bcrypt from "bcryptjs"
import { validateRegister } from "../middlewares/validate.js"

const query = util.promisify(db.query).bind(db)

export const getUser = (req, res) => {
    res.status(200).json("funciona")
}

export const deleteUser = async (req, res) => {
    try {
        const {iduser} = req.params
        await query('DELETE FROM user WHERE id = ?', [iduser])
        // res.redirect('/list')
        res.status(200).json("Usuario borrado")
    }
    catch (error) {
        res.status(500).json({message:error.message})    
    }
}

export const createUser = [validateRegister, async (req,res) => {
    console.log("Datos recibidos:",req.body);
    try {
        const q = "SELECT dni FROM persona WHERE dni = ?"
    
        const data = await query(q, [req.body.dni])

        if (data.length) {
            return res.status(409).json("Usuario existente")
        }

        const values_persona = [req.body.apellido, req.body.nombre, req.body.dni, req.body.cuil, req.body.direccion_id, req.body.tipo_persona_id]

        const resultados = await query('INSERT INTO persona (`apellido`, `nombre`, `dni`, `cuil`, `direccion_id`, `tipo_persona_id`) VALUES (?)', [values_persona])

        const idNuevaPersona = resultados.insertId

        const salt = bcrypt.genSaltSync(10)

        const encrypt_password = bcrypt.hashSync(req.body.password, salt)

        const values_user = [req.body.username, encrypt_password, req.body.created_at, req.body.updated_at, idNuevaPersona, req.body.rol_id, req.body.tipo_estado_id]

        await query('INSERT INTO user (`username`, `password`, `created_at`, `updated_at`, `persona_id`, `rol_id`, `tipo_estado_id`) VALUES (?) ', [values_user])

        res.status(200).json("Usuario creado")
    } 
    catch (err){
        res.status(500).json({message:err.message})
    }
}

]


