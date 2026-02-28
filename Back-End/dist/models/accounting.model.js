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
export class AccountingModel {
    /**
     * Retrieves all invoices for accounting (purchases, payments, etc.).
     * @returns A promise that resolves to an array of invoices.
     */
    static async getFacturas() {
        const sql = `
        SELECT 
            cf.id,
            COALESCE(p.nombre, 'Venta') AS descripcion,
            cf.fecha_factura AS fecha,
            COALESCE(df.precio, 0) AS ingreso,
            0 AS egreso
        FROM cabecera_factura cf
        LEFT JOIN detalle_factura df ON cf.id = df.cabecera_factura_id
        LEFT JOIN persona p ON cf.comprador_id = p.id
        ORDER BY cf.fecha_factura DESC
        `;
        return query(sql);
    }
    /**
     * Finds a persona by their DNI.
     * @param dni - The DNI to search for.
     * @returns A promise that resolves to the persona result.
     */
    static async findPersonaByDni(dni) {
        const q = 'SELECT id, nombre FROM persona WHERE dni = ?';
        return query(q, [dni]);
    }
    /**
     * Creates a complete accounting transaction with a header and detailed record.
     * @param data - The transaction data.
     * @returns A promise that resolves when the transaction is complete.
     * @throws Error if the transaction fails.
     */
    static async createTransaction(data) {
        const beginTransaction = util.promisify(db.beginTransaction).bind(db);
        const commit = util.promisify(db.commit).bind(db);
        const rollback = util.promisify(db.rollback).bind(db);
        try {
            await beginTransaction();
            const valores_cabecera = [data.fecha, data.nro_factura, data.precioBase, data.descuento, data.tipo_factura, data.comprador_id];
            const resCabecera = await query('INSERT INTO cabecera_factura (`fecha_factura`, `numero_factura`, `sub_total`, `descuento`, `tipo_factura`, `comprador_id`) VALUES (?)', [valores_cabecera]);
            const idNuevaFactura = resCabecera.insertId;
            const values_detalle_factura = [data.detalle, data.precioFinal, idNuevaFactura];
            await query('INSERT INTO detalle_factura (`detalle`, `precio`, `cabecera_factura_id`) VALUES (?)', [values_detalle_factura]);
            await commit();
        }
        catch (err) {
            await rollback();
            throw err;
        }
    }
}
