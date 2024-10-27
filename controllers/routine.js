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
        // Iniciar una transacción
        await query('START TRANSACTION');

        // Eliminar las filas relacionadas de la tabla intermedia rutina_ejercicio
        const deleteIntermediaSQL = 'DELETE FROM rutina_ejercicio WHERE rutina_id = ?';
        const resultIntermedia = await query(deleteIntermediaSQL, [id]);

        // Verificar si alguna fila de la tabla intermedia fue eliminada (esto es opcional)
        if (resultIntermedia.affectedRows === 0) {
            // Si no se encuentran registros relacionados en la tabla intermedia, se puede lanzar una advertencia o simplemente continuar
            console.warn(`No se encontraron ejercicios relacionados para la rutina con ID ${id}`);
        }

        // Ahora eliminar la rutina de la tabla rutina
        const deleteRoutineSQL = 'DELETE FROM rutina WHERE id = ?';
        const resultRoutine = await query(deleteRoutineSQL, [id]);

        // Verificar si la rutina fue eliminada
        if (resultRoutine.affectedRows === 0) {
            // Si no se encontró la rutina, deshacer la transacción y devolver error
            await query('ROLLBACK');
            return res.status(404).json({ error: "Rutina no encontrada" });
        }

        // Confirmar la transacción
        await query('COMMIT');

        // Responder éxito
        res.status(200).json({ message: "La Rutina ha sido eliminada correctamente" });
    } catch (err) {
        // En caso de error, deshacer la transacción
        await query('ROLLBACK');
        res.status(500).json({ error: err.message });
    }
}



export const updateRoutine = async (req, res) => {
    

    const { id } = req.params;
    const { descripcion, ejercicios } = req.body;

    if (!id) {
        return res.status(400).json({ error: "El ID de la rutina es requerido" });
    }

    try {
        // Log para verificar los datos que llegan
        console.log(`Actualizando rutina con id ${id} y descripción ${descripcion}`);

        // Actualiza la descripción de la rutina
        const updateRoutineQuery = 'UPDATE rutina SET descripcion = ? WHERE id = ?';
        const resultRoutine = await query(updateRoutineQuery, [descripcion, id]);

        console.log('Result Routine:', resultRoutine); // Verificar el resultado de la actualización

        if (resultRoutine.affectedRows === 0) {
            return res.status(404).json({ error: "Rutina no encontrada" });
        }

        // Actualiza cada ejercicio
        for (const ejercicio of ejercicios) {
            console.log(`Actualizando ejercicio con id ${ejercicio.id} para la rutina ${id}`);
            
            const updateExerciseQuery = 'UPDATE rutina_ejercicio SET ejercicio_id = ?, series = ?, repeticiones = ? WHERE rutina_id = ? AND id = ?';
            const resultExercise = await query(updateExerciseQuery, [ejercicio.ejercicio_id, ejercicio.series, ejercicio.repeticiones, id, ejercicio.id]);

            console.log('Result Exercise:', resultExercise); // Verificar el resultado de la actualización

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