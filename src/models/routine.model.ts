import { db } from "../connect.js";
import util from "util";
const query = (sql: string, values?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

export class RoutineModel {
    static async getRoutines() {
        return query('SELECT * FROM rutina');
    }

    static async getRoutineById(id: number) {
        const sql = `
        SELECT re.id, re.ejercicio_id, re.series, re.repeticiones
        FROM rutina_ejercicio re
        JOIN ejercicio e ON re.ejercicio_id = e.id
        WHERE re.rutina_id = ?
    `;
        return query(sql, [id]);
    }

    static async createRoutine(descripcion: string, ejercicios: any[]) {
        const beginTransaction = util.promisify(db.beginTransaction).bind(db);
        const commit = util.promisify(db.commit).bind(db);
        const rollback = util.promisify(db.rollback).bind(db);

        try {
            await beginTransaction();
            const result: any = await query('INSERT INTO rutina (descripcion, tipo_estado_id) VALUES (?, ?)', [descripcion, 1]);
            const rutinaId = result.insertId;

            const inserts = ejercicios.map(ejercicio => {
                return query(
                    'INSERT INTO rutina_ejercicio (rutina_id, ejercicio_id, series, repeticiones, orden, descanso, numero_dia, tipo_estado_id, dias_semana_id) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1)',
                    [rutinaId, ejercicio.ejercicioId, ejercicio.series, ejercicio.repeticiones, ejercicio.orden, ejercicio.descanso, ejercicio.numeroDia]
                );
            });

            await Promise.all(inserts);
            await commit();
            return rutinaId;
        } catch (err) {
            await rollback();
            throw err;
        }
    }

    static async deleteRoutine(id: number) {
        const beginTransaction = util.promisify(db.beginTransaction).bind(db);
        const commit = util.promisify(db.commit).bind(db);
        const rollback = util.promisify(db.rollback).bind(db);

        try {
            await beginTransaction();
            await query('DELETE FROM rutina_ejercicio WHERE rutina_id = ?', [id]);
            const resultRoutine: any = await query('DELETE FROM rutina WHERE id = ?', [id]);

            if (resultRoutine.affectedRows === 0) {
                throw new Error("Rutina no encontrada");
            }

            await commit();
        } catch (err) {
            await rollback();
            throw err;
        }
    }

    static async updateRoutine(id: number, descripcion: string, ejercicios: any[]) {
        const beginTransaction = util.promisify(db.beginTransaction).bind(db);
        const commit = util.promisify(db.commit).bind(db);
        const rollback = util.promisify(db.rollback).bind(db);

        try {
            await beginTransaction();
            const resultRoutine: any = await query('UPDATE rutina SET descripcion = ? WHERE id = ?', [descripcion, id]);

            if (resultRoutine.affectedRows === 0) {
                throw new Error("Rutina no encontrada");
            }

            for (const ejercicio of ejercicios) {
                const resultExercise: any = await query(
                    'UPDATE rutina_ejercicio SET ejercicio_id = ?, series = ?, repeticiones = ? WHERE rutina_id = ? AND id = ?',
                    [ejercicio.ejercicio_id, ejercicio.series, ejercicio.repeticiones, id, ejercicio.id]
                );
                if (resultExercise.affectedRows === 0) {
                    throw new Error(`Ejercicio con id ${ejercicio.id} no encontrado en la rutina`);
                }
            }

            await commit();
        } catch (err) {
            await rollback();
            throw err;
        }
    }
}
