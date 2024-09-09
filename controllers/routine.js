import { Result } from "express-validator";
import { db } from "../connect.js";
import util from "util";
import { error } from "console";
const query = util.promisify(db.query).bind(db);


export const getRoutines = async (req, res) => {
    try {
        const sql = 'SELECT * FROM rutina';
        const routines = await query(sql);
        
        if (routines.length === 0) {
            return res.status(404).json({ error: "No se encontraron rutinas" });
        }

        res.status(200).json(routines);
    } catch (err) {
        console.error("Error al obtener rutinas:", err.message);
        res.status(500).json({ error: err.message });
    }
};

export const createRoutine = async (req,res) =>{
    const {descripcion,ejercicios} = req.body;

    try {
        const result = await query('INSERT INTO rutina (descripcion,tipo_estado_id) VALUES (?,?)',[descripcion,1]);
        const rutinaId= result.insertId;
        
        const inserts= ejercicios.map(ejercicio => {
            return query(
                'INSERT INTO rutina_ejercicio (rutina_id,ejercicio_id,series,repeticiones,orden,descanso,numero_dia, tipo_estado_id, dias_semana_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [rutinaId, ejercicio.ejercicioId, ejercicio.series, ejercicio.repeticiones, ejercicio.orden, ejercicio.descanso, ejercicio.numeroDia, ejercicio.tipoEstadoId, ejercicio.diasSemanaId]
            );
        });

        await Promise.all(inserts);

        res.status(200).send({message: 'Rutina creada con exito'});
    } catch (err){
        res.status(500).send({message:err.message});
    }
}

// Eliminar un ejercicio
export const deleteRoutine = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "El ID de la rutina es requerido" });
    }

    try {
        const sql = 'DELETE FROM rutina WHERE id = ?';
        const result = await query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Rutina no encontrada" });
        }

        res.status(200).json({ message: " La Rutina a sido eliminada correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}