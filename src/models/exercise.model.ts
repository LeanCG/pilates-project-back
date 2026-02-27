import { db } from "../connect.js";
const query = (sql: string, values?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

export class ExerciseModel {
    static async getExercises() {
        return query("SELECT * FROM ejercicio");
    }

    static async createExercise(data: {
        descripcion: string;
        observacion?: string;
        grupo_muscular?: string;
        url_video?: string;
        calorias_promedio?: string;
        nivel_dificultad?: string;
    }) {
        const sql = 'INSERT INTO ejercicio (descripcion, observacion, grupo_muscular, url_video, calorias_promedio, nivel_dificultad) VALUES (?, ?, ?, ?, ?, ?)';
        return query(sql, [
            data.descripcion, data.observacion, data.grupo_muscular,
            data.url_video, data.calorias_promedio, data.nivel_dificultad
        ]);
    }

    static async updateExercise(id: number, data: {
        descripcion: string;
        observacion?: string;
        grupo_muscular?: string;
        url_video?: string;
        calorias_promedio?: string;
        nivel_dificultad?: string;
    }) {
        const sql = `
        UPDATE ejercicio
        SET descripcion = ?, observacion = ?, grupo_muscular = ?, url_video = ?, calorias_promedio = ?, nivel_dificultad = ?
        WHERE id = ?
    `;
        return query(sql, [
            data.descripcion, data.observacion, data.grupo_muscular,
            data.url_video, data.calorias_promedio, data.nivel_dificultad, id
        ]);
    }

    static async deleteExercise(id: number) {
        const sql = 'DELETE FROM ejercicio WHERE id = ?';
        return query(sql, [id]);
    }
}
