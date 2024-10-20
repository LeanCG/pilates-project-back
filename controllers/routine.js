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
                'INSERT INTO rutina_ejercicio (rutina_id,ejercicio_id,series,repeticiones,orden,descanso,numero_dia, tipo_estado_id, dias_semana_id) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1)',
                [rutinaId, ejercicio.ejercicioId, ejercicio.series, ejercicio.repeticiones, ejercicio.orden, ejercicio.descanso, ejercicio.numeroDia]
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

// Modificar rutina y sus ejercicios
export const updateRoutine = async (req, res) => {
    const { id } = req.params;
    const { descripcion, ejercicios } = req.body;  // El body ahora incluye la descripción y una lista de ejercicios

    if (!id) {
        return res.status(400).json({ error: "El ID de la rutina es requerido" });
    }

    try {
        // Actualiza la descripción de la rutina en la tabla rutina
        const updateRoutineQuery = 'UPDATE rutina SET descripcion = ? WHERE id = ?';
        const resultRoutine = await query(updateRoutineQuery, [descripcion, id]);

        if (resultRoutine.affectedRows === 0) {
            return res.status(404).json({ error: "Rutina no encontrada" });
        }

        // Actualiza cada ejercicio asociado en la tabla rutina_ejercicio
        for (const ejercicio of ejercicios) {
            const updateExerciseQuery = 'UPDATE rutina_ejercicio SET series = ?, repeticiones = ? WHERE rutina_id = ? AND ejercicio_id = ?';
            const resultExercise = await query(updateExerciseQuery, [ejercicio.series, ejercicio.repeticiones, id, ejercicio.id]);

            if (resultExercise.affectedRows === 0) {
                return res.status(404).json({ error: `Ejercicio con id ${ejercicio.id} no encontrado en la rutina` });
            }
        }

        res.status(200).send({ message: 'Rutina y ejercicios actualizados con éxito' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const getRoutineId = async (req, res) => {
try {
    const { id } = req.params;

    const sql = `
        SELECT re.id,re.ejercicio_id, re.series, re.repeticiones
        FROM rutina_ejercicio re
        JOIN ejercicio e ON re.ejercicio_id = e.id
        WHERE re.rutina_id = ?
    `;

    const results = await query(sql, [id])
    if (results.length === 0) {
        return res.status(404).json({ error: "No se encontraron rutinas" });
    }

    res.status(200).json(results);
} catch (err) {
    console.error("Error al obtener rutinas:", err.message);
    res.status(500).json({ error: err.message });
}
};