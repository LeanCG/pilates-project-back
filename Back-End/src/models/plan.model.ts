import { db } from "../connect.js";

const query = (sql: string, values?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error: any, results: any) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

export class PlanModel {
    static async getAll() {
        return query('SELECT * FROM plan WHERE estado_id = 1 ORDER BY precio ASC');
    }

    static async getById(id: number) {
        const plans: any = await query('SELECT * FROM plan WHERE id = ?', [id]);
        return plans[0] || null;
    }
}
