import { db } from "../connect.js";

const query = (sql: string, values?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error: any, results: any) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

export class DeudaModel {
    static async getByClient(clienteId: number) {
        const sql = `
            SELECT 
                d.id, d.cliente_id, d.monto, d.monto_original, d.intereses,
                d.fecha_vencimiento, d.estado, d.fecha_pago, d.created_at,
                CONCAT(p.nombre, ' ', p.apellido) AS cliente_nombre
            FROM deuda d
            JOIN user u ON d.cliente_id = u.id
            JOIN persona p ON u.persona_id = p.id
            WHERE d.cliente_id = ?
            ORDER BY d.fecha_vencimiento ASC
        `;
        return query(sql, [clienteId]);
    }

    static async getAll(filters?: { estado?: string; cliente_id?: number }) {
        let sql = `
            SELECT 
                d.id, d.cliente_id, d.monto, d.monto_original, d.intereses,
                d.fecha_vencimiento, d.estado, d.fecha_pago, d.created_at,
                CONCAT(p.nombre, ' ', p.apellido) AS cliente_nombre
            FROM deuda d
            JOIN user u ON d.cliente_id = u.id
            JOIN persona p ON u.persona_id = p.id
            WHERE 1=1
        `;
        
        const params: any[] = [];
        
        if (filters?.estado) {
            sql += ' AND d.estado = ?';
            params.push(filters.estado);
        }
        
        if (filters?.cliente_id) {
            sql += ' AND d.cliente_id = ?';
            params.push(filters.cliente_id);
        }
        
        sql += ' ORDER BY d.fecha_vencimiento ASC';
        
        return query(sql, params);
    }

    static async getPending() {
        const sql = `
            SELECT 
                d.id, d.cliente_id, d.monto, d.monto_original, d.intereses,
                d.fecha_vencimiento, d.estado, d.created_at,
                CONCAT(p.nombre, ' ', p.apellido) AS cliente_nombre,
                DATEDIFF(d.fecha_vencimiento, CURDATE()) AS dias_vencimiento
            FROM deuda d
            JOIN user u ON d.cliente_id = u.id
            JOIN persona p ON u.persona_id = p.id
            WHERE d.estado = 'pendiente'
            ORDER BY d.fecha_vencimiento ASC
        `;
        return query(sql);
    }

    static async create(clienteId: number, data: { monto: number; monto_original: number; intereses?: number; fecha_vencimiento: string }) {
        const sql = `
            INSERT INTO deuda (cliente_id, monto, monto_original, intereses, fecha_vencimiento, estado)
            VALUES (?, ?, ?, ?, ?, 'pendiente')
        `;
        const result: any = await query(sql, [
            clienteId,
            data.monto,
            data.monto_original,
            data.intereses || 0,
            data.fecha_vencimiento
        ]);
        return result.insertId;
    }

    static async pay(id: number) {
        const sql = `
            UPDATE deuda 
            SET estado = 'pagada', fecha_pago = CURDATE() 
            WHERE id = ?
        `;
        await query(sql, [id]);
        return { message: 'Deuda pagada' };
    }

    static async cancel(id: number) {
        await query('UPDATE deuda SET estado = "cancelada" WHERE id = ?', [id]);
        return { message: 'Deuda cancelada' };
    }

    static async getSummary(clienteId: number) {
        const sql = `
            SELECT 
                SUM(CASE WHEN estado = 'pendiente' THEN monto ELSE 0 END) AS total_pendiente,
                SUM(CASE WHEN estado = 'pagada' THEN monto ELSE 0 END) AS total_pagado,
                COUNT(CASE WHEN estado = 'pendiente' THEN 1 END) AS cantidad_pendiente
            FROM deuda
            WHERE cliente_id = ?
        `;
        return query(sql, [clienteId]);
    }
}
