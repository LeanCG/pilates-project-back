import { db } from "../connect.js"
import util from 'util'
import bcrypt from "bcryptjs"
import { validateRegister } from "../middlewares/validate.js"

const query = util.promisify(db.query).bind(db)

export const deleteUser = async (req, res) => {
    try {
        const {id} = req.params
        await query('UPDATE user SET `tipo_estado_id` = ? WHERE persona_id = ?', [3, id]);
        // res.redirect('/list')
        res.status(200).json("Usuario borrado")
    }
    catch (error) {
        res.status(500).json({message:error.message})    
    }
}

export const createUser = [validateRegister, async (req,res) => {
    try {
        const q = "SELECT dni FROM persona WHERE dni = ?"
    
        const data = await query(q, [req.body.dni])

        if (data.length) {
            return res.status(409).json("Usuario existente")
        }

        const values_persona = [req.body.apellido, req.body.nombre, req.body.dni, req.body.cuil, req.body.direccion_id, req.body.tipo_persona_id]

        let resultados = await query('INSERT INTO persona (`apellido`, `nombre`, `dni`, `cuil`, `direccion_id`, `tipo_persona_id`) VALUES (?)', [values_persona])

        const idNuevaPersona = resultados.insertId

        const salt = bcrypt.genSaltSync(10)

        const encrypt_password = bcrypt.hashSync(req.body.password, salt)

        const values_user = [req.body.username, encrypt_password, req.body.created_at, req.body.updated_at, idNuevaPersona, req.body.rol_id, req.body.tipo_estado_id]

        resultados = await query('INSERT INTO user (`username`, `password`, `created_at`, `updated_at`, `persona_id`, `rol_id`, `tipo_estado_id`) VALUES (?) ', [values_user])

        const idNuevoUser = resultados.insertId

        const values_turn = [req.body.fecha_turno, req.body.hora, idNuevoUser, req.body.tipo_pilates_id, 1]

        await query('INSERT INTO turnos_alta_usuario (`fecha_turno`, `hora`, `user_id`, `tipo_pilates_id`, `tipo_estado_id`) VALUES (?)', [values_turn])
        // const values_payment = []

        res.status(200).json("Usuario creado")
    } 
    catch (err){
        res.status(500).json({message:err.message})
    }
}]

export const editUser = [validateRegister, async (req, res) => {
    try {

        const {id} = req.params

        console.log(id)

        const values_persona = [req.body.apellido, req.body.nombre, req.body.dni, req.body.cuil, req.body.direccion_id, req.body.tipo_persona_id]

        const salt = bcrypt.genSaltSync(10)
        const encrypt_password = bcrypt.hashSync(req.body.password, salt)

        const values_user = [req.body.username, encrypt_password, req.body.created_at, req.body.updated_at, req.body.rol_id, req.body.tipo_estado_id]

        const q = "SELECT id FROM user WHERE username = ? AND persona_id != ?";
        const data = await query(q, [req.body.username, id]);

        if (data.length) {
            return res.status(409).json("Nombre en uso");
        }


        await query('UPDATE persona SET `apellido` = ?, `nombre` = ?, `dni` = ?, `cuil` = ?, `direccion_id` = ?, `tipo_persona_id` = ? WHERE `id` = ?', [...values_persona, id]);

        await query('UPDATE user SET `username` = ?, `password` = ?, `created_at` = ?, `updated_at` = ?, `rol_id` = ?, `tipo_estado_id` = ? WHERE `persona_id` = ?', [...values_user, id]);


        res.status(200).json("Usuario actualizado correctamente")
    }
    catch (err) {
        res.status(500).json({message: err.message})
    }
}]


export const editUsuario = [validateRegister, async (req, res) => {
    try {

        const {id} = req.params

        console.log(id)

        let {apellido, nombre, dni, cuil, direccion_id, tipo_persona_id, username, password, created_at, updated_at, rol_id, tipo_estado_id} = req.body
        const editPersona = {apellido, nombre, dni, cuil, direccion_id, tipo_persona_id}

        const salt = bcrypt.genSaltSync(10)
        password = bcrypt.hashSync(password, salt)

        const editUsuario = {username, password, created_at, updated_at,rol_id, tipo_estado_id}

        const q = "SELECT id FROM user WHERE username = ? AND persona_id != ?";
        const data = await query(q, [username, id]);

        if (data.length) {
            return res.status(409).json("Nombre en uso");
        }

        await query('UPDATE persona SET ? WHERE id = ?', [editPersona, id]);

        await query('UPDATE user SET ? WHERE persona_id = ?', [editUsuario, id]);


        res.status(200).json("Usuario actualizado correctamente")
    }
    catch (err) {
        res.status(500).json({message: err.message})
    }
}]

export const listUsers = async (req, res) => {
    try{
        const sql = `
        SELECT 
            p.id AS id, 
            p.apellido, 
            p.nombre, 
            p.dni, 
            p.cuil,
            u.id AS user_id, 
            u.username, 
            u.created_at, 
            u.updated_at, 
            u.rol_id, 
            u.tipo_estado_id
        FROM 
            persona p
        JOIN 
            user u ON p.id = u.persona_id`
        const consulta = `SELECT * SELECT p.id AS persona_id, p.apellido, p.nombre,
                            p.dni, u.id AS user_id, u.username,
                            u.created_at, t.id AS turno_id, t.fecha, t.hora FROM persona p
                            JOIN user u ON p.id = u.persona_id JOIN turnos t ON u.id = t.user_id`

        const data = await query(sql)
        
        res.status(200).json(data)
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

