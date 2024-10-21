import { db } from "../connect.js"
import util from 'util'
import bcrypt from "bcryptjs"
import { validateRegisterEdit } from "../middlewares/validate_edit.js"
import { calcularDescuento } from "../middlewares/descuento.js"
import { json } from "express"
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

        const values_direccion = [req.body.direccion, req.body.municipio_id]

        let resultados = await query('INSERT INTO direccion (`descripcion`, `municipio_id`) VALUES (?)', [values_direccion])

        const idNuevaDireccion = resultados.insertId

        const values_persona = [req.body.apellido, req.body.nombre, req.body.dni, req.body.cuil, idNuevaDireccion, req.body.tipo_persona_id]

        resultados = await query('INSERT INTO persona (`apellido`, `nombre`, `dni`, `cuil`, `direccion_id`, `tipo_persona_id`) VALUES (?)', [values_persona])

        const idNuevaPersona = resultados.insertId

        const salt = bcrypt.genSaltSync(10)

        const encrypt_password = bcrypt.hashSync(req.body.password, salt)

        const values_user = [req.body.username, encrypt_password, new Date(), new Date(), idNuevaPersona, req.body.rol_id, 1]

        resultados = await query('INSERT INTO user (`username`, `password`, `created_at`, `updated_at`, `persona_id`, `rol_id`, `tipo_estado_id`) VALUES (?) ', [values_user])

        const idNuevoUser = resultados.insertId

        const {fecha_turno} = req.body

        const values_turn = [fecha_turno, req.body.hora, idNuevoUser, req.body.tipo_pilates_id, 1, req.body.dias_turno_id]

        await query('INSERT INTO turnos_alta_usuario (`fecha_turno`, `hora`, `user_id`, `tipo_pilates_id`, `tipo_estado_id`, `dias_turno_id`) VALUES (?)', [values_turn])
        
        let precio = req.body.precio

        if (Number(req.body.descuento) > 0){
            precio = calcularDescuento(req.body.precio, req.body.descuento)
        }

        const values_factura = [fecha_turno, req.body.numero_factura, req.body.sub_total, req.body.descuento, idNuevaPersona]

        resultados = await query('INSERT INTO cabecera_factura (`fecha_factura`, `numero_factura`, `sub_total`, `descuento`, `comprador_id`) VALUES (?)', [values_factura])

        const idNuevaFactura = resultados.insertId

        const values_detalle_factura = [req.body.cantidad, precio, idNuevaFactura]

        await query('INSERT INTO detalle_factura (`cantidad`, `precio`, `cabecera_factura_id`) VALUES (?)', [values_detalle_factura])

        res.status(200).json("Usuario creado")
    } 
    catch (err){
        res.status(500).json({message:err.message})
    }
}]

export const editUser = [validateRegisterEdit, async (req, res) => {
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

export const editUsuario = [validateRegisterEdit, async (req, res) => {
    try {

        const {id} = req.params

        console.log(id)

        let {apellido, nombre, dni, cuil, username} = req.body
        const editPersona = {apellido, nombre, dni, cuil}

        const editUsuario = {username}

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
        p.id,
        p.nombre,
        p.apellido,
        p.dni,
        p.cuil,
        d.descripcion AS direccion,
        tp.descripcion AS tipo_persona,
        te.descripcion AS tipo_estado
    FROM 
        persona p
    JOIN 
        user u ON p.id = u.persona_id
    JOIN 
        direccion d ON p.direccion_id = d.id
    JOIN 
        tipo_persona tp ON p.tipo_persona_id = tp.id
    JOIN 
        tipo_estado te ON u.tipo_estado_id = te.id;
`
        const data = await query(sql)
        res.status(200).json(data)
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

export const infoUser = async (req, res) => {
    try{
        const userId = req.params.id
        const sql = `
        SELECT 
            p.id AS persona_id,
            p.apellido,
            p.nombre,
            p.dni,
            p.cuil,
            d.descripcion AS direccion,
            m.descripcion AS municipio,
            depto.descripcion AS departamento,
            prov.descripcion AS provincia,
            pais.descripcion AS pais,
            tp.descripcion AS tipo_persona,
            u.username,
            u.created_at,
            u.updated_at,
            r.descripcion AS rol,
            te.descripcion AS tipo_estado
        FROM 
            user u
        INNER JOIN 
            persona p ON u.persona_id = p.id
        INNER JOIN 
            direccion d ON p.direccion_id = d.id
        INNER JOIN 
            municipio m ON d.municipio_id = m.id
        INNER JOIN 
            departamento depto ON m.departamento_id = depto.id
        INNER JOIN 
            provincia prov ON depto.provincia_id = prov.id
        INNER JOIN 
            pais pais ON prov.pais_id = pais.id
        INNER JOIN 
            tipo_persona tp ON p.tipo_persona_id = tp.id
        INNER JOIN 
            rol r ON u.rol_id = r.id
        INNER JOIN 
            tipo_estado te ON u.tipo_estado_id = te.id
        WHERE 
            p.id = ?  -- Usamos el id de persona en la condición
        `
        const data = await query(sql, [userId])
        res.status(200).json(data)
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}


