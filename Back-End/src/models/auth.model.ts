import { db } from "../connect.js";
const query = (sql: string, values?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error, results) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

export class AuthModel {
    static async findByUsernameForLogin(username: string) {
        const q = "SELECT id, username, password, rol_id FROM user WHERE username = ?";
        const result: any = await query(q, [username]);
        return result;
    }
}
