import { db } from "../connect.js"
import util from 'util'

const query = util.promisify(db.query).bind(db)

export const getUser = (req, res) => {
    res.status(200).json("funciona")
}

export const deleteUser = async (req, res) => {
    try {
        const {iduser} = req.params
        await query('DELETE FROM user WHERE iduser = ?', [iduser])
        // res.redirect('/list')
        res.status(200).json("Usuario borrado")
    }
    catch (error) {
        res.status(500).json({message:err.message})    
    }
}

export const createUser = async (req,res) => {
    try {
        const q = "SELECT dni FROM persona WHERE dni = ?"
    
        const data = await query(q, [req.body.dni])

        if (data.length) {
            return res.status(409).json("Usuario existente")
        }

        const values_persona = [req.body.apellido, req.body.nombre, req.body.dni, req.body.cuil, req.body.direccion_id, req.body.tipo_persona_id]

        await query('INSERT INTO persona (`apellido`, `nombre`, `dni`, `cuil`, `direccion_id`, `tipo_persona_id`) VALUES (?)', [values_persona])

        // const values_user = [req.body.username, encrypt_password, req.body.created_at, req.body.updated_at, id, estado, rol_id, tipo_estado_id]

        // await query('INSERT INTO user (`username`, ``password`, `created_at`, `updated_at`, `persona_id`, `estado`, `rol_id`, `tipo_estado_id`', [values_user])

        res.status(200).json("Usuario creado")
    } 
    catch (error){
        res.status(500).json({message:error.message})
    }
}


