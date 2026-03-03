import { db } from "../connect.js";
import util from "util";
const query = (sql, values) => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error, results) => {
            if (error)
                return reject(error);
            resolve(results);
        });
    });
};
export class RoutineModel {
    /**
     * Gets all routines from the database.
     * @returns A promise that resolves to an array of routines.
     */
    static async getRoutines() {
        return query('SELECT id, descripcion AS rutina FROM rutina');
    }
    /**
     * Gets a routine by its ID.
     * @param id - The ID of the routine to fetch.
     * @returns A promise that resolves to the routine details with its associated exercises.
     */
    static async getRoutineById(id) {
        const sql = `
        SELECT re.id, re.ejercicio_id, re.series, re.repeticiones
        FROM rutina_ejercicio re
        JOIN ejercicio e ON re.ejercicio_id = e.id
        WHERE re.rutina_id = ?
    `;
        return query(sql, [id]);
    }
    /**
     * Creates a new routine along with its exercises.
     * @param descripcion - The description of the routine.
     * @param ejercicios - An array of exercises associated with the routine.
     * @returns A promise that resolves to the ID of the newly created routine.
     * @throws Error if the transaction fails.
     */
    static async createRoutine(descripcion, ejercicios) {
        const beginTransaction = util.promisify(db.beginTransaction).bind(db);
        const commit = util.promisify(db.commit).bind(db);
        const rollback = util.promisify(db.rollback).bind(db);
        try {
            await beginTransaction();
            const result = await query('INSERT INTO rutina (descripcion, tipo_estado_id) VALUES (?, ?)', [descripcion, 1]);
            const rutinaId = result.insertId;
            const inserts = ejercicios.map(ejercicio => {
                return query('INSERT INTO rutina_ejercicio (rutina_id, ejercicio_id, series, repeticiones, orden, descanso, numero_dia, tipo_estado_id, dias_semana_id) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1)', [rutinaId, ejercicio.ejercicioId, ejercicio.series, ejercicio.repeticiones, ejercicio.orden, ejercicio.descanso, ejercicio.numeroDia]);
            });
            await Promise.all(inserts);
            await commit();
            return rutinaId;
        }
        catch (err) {
            await rollback();
            throw err;
        }
    }
    /**
     * Deletes a routine and its associated exercises.
     * @param id - The ID of the routine to delete.
     * @returns A promise that resolves when the routine is deleted.
     * @throws Error if the routine is not found.
     */
    static async deleteRoutine(id) {
        const beginTransaction = util.promisify(db.beginTransaction).bind(db);
        const commit = util.promisify(db.commit).bind(db);
        const rollback = util.promisify(db.rollback).bind(db);
        try {
            await beginTransaction();
            await query('DELETE FROM rutina_ejercicio WHERE rutina_id = ?', [id]);
            const resultRoutine = await query('DELETE FROM rutina WHERE id = ?', [id]);
            if (resultRoutine.affectedRows === 0) {
                throw new Error("Rutina no encontrada");
            }
            await commit();
        }
        catch (err) {
            await rollback();
            throw err;
        }
    }
    /**
     * Updates an existing routine and its associated exercises.
     * @param id - The ID of the routine to update.
     * @param descripcion - The new description of the routine.
     * @param ejercicios - An array of exercises to update.
     * @returns A promise that resolves when the update is complete.
     * @throws Error if the routine or any exercise is not found.
     */
    static async updateRoutine(id, descripcion, ejercicios) {
        const beginTransaction = util.promisify(db.beginTransaction).bind(db);
        const commit = util.promisify(db.commit).bind(db);
        const rollback = util.promisify(db.rollback).bind(db);
        try {
            await beginTransaction();
            const resultRoutine = await query('UPDATE rutina SET descripcion = ? WHERE id = ?', [descripcion, id]);
            if (resultRoutine.affectedRows === 0) {
                throw new Error("Rutina no encontrada");
            }
            for (const ejercicio of ejercicios) {
                const resultExercise = await query('UPDATE rutina_ejercicio SET ejercicio_id = ?, series = ?, repeticiones = ? WHERE rutina_id = ? AND id = ?', [ejercicio.ejercicio_id, ejercicio.series, ejercicio.repeticiones, id, ejercicio.id]);
                if (resultExercise.affectedRows === 0) {
                    throw new Error(`Ejercicio con id ${ejercicio.id} no encontrado en la rutina`);
                }
            }
            await commit();
        }
        catch (err) {
            await rollback();
            throw err;
        }
    }
}
