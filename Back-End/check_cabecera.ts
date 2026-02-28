import { db } from "./src/connect.js";

const query = (sql: string, values?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error: any, results: any) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

async function check() {
    try {
        const estructura = await query("DESCRIBE cabecera_factura");
        console.log("Estructura:", estructura);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        db.end();
    }
}

check();
