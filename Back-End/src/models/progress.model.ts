import { db } from "../connect.js";

const query = (sql: string, values?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error: any, results: any) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

export class ProgressModel {
    static async getByClient(clienteId: number) {
        const sql = `
            SELECT 
                id, cliente_id, fecha, peso, observaciones, created_at
            FROM progreso
            WHERE cliente_id = ?
            ORDER BY fecha DESC
        `;
        return query(sql, [clienteId]);
    }

    static async getAll(filters?: { cliente_id?: number; fecha_inicio?: string; fecha_fin?: string }) {
        let sql = `
            SELECT 
                p.id, p.cliente_id, p.fecha, p.peso, p.observaciones, p.created_at,
                u.persona_id,
                CONCAT(pr.nombre, ' ', pr.apellido) AS cliente_nombre
            FROM progreso p
            JOIN user u ON p.cliente_id = u.id
            JOIN persona pr ON u.persona_id = pr.id
            WHERE 1=1
        `;
        
        const params: any[] = [];
        
        if (filters?.cliente_id) {
            sql += ' AND p.cliente_id = ?';
            params.push(filters.cliente_id);
        }
        
        if (filters?.fecha_inicio) {
            sql += ' AND p.fecha >= ?';
            params.push(filters.fecha_inicio);
        }
        
        if (filters?.fecha_fin) {
            sql += ' AND p.fecha <= ?';
            params.push(filters.fecha_fin);
        }
        
        sql += ' ORDER BY p.fecha DESC';
        
        return query(sql, params);
    }

    static async create(clienteId: number, data: { fecha: string; peso?: number; observaciones?: string }) {
        const sql = `
            INSERT INTO progreso (cliente_id, fecha, peso, observaciones)
            VALUES (?, ?, ?, ?)
        `;
        const result: any = await query(sql, [
            clienteId,
            data.fecha,
            data.peso || null,
            data.observaciones || null
        ]);
        return result.insertId;
    }

    static async update(id: number, data: { fecha?: string; peso?: number; observaciones?: string }) {
        const updates: string[] = [];
        const values: any[] = [];

        if (data.fecha !== undefined) {
            updates.push('fecha = ?');
            values.push(data.fecha);
        }
        if (data.peso !== undefined) {
            updates.push('peso = ?');
            values.push(data.peso);
        }
        if (data.observaciones !== undefined) {
            updates.push('observaciones = ?');
            values.push(data.observaciones);
        }

        if (updates.length === 0) {
            throw new Error('No hay valores para actualizar');
        }

        values.push(id);
        await query(`UPDATE progreso SET ${updates.join(', ')} WHERE id = ?`, values);
        return { message: 'Progreso actualizado' };
    }

    static async delete(id: number) {
        await query('DELETE FROM progreso WHERE id = ?', [id]);
        return { message: 'Progreso eliminado' };
    }

    static async getLatest(clienteId: number) {
        const sql = `
            SELECT * FROM progreso
            WHERE cliente_id = ?
            ORDER BY fecha DESC
            LIMIT 1
        `;
        return query(sql, [clienteId]);
    }

    static async getHistory(clienteId: number, limit: number = 10) {
        const sql = `
            SELECT * FROM progreso
            WHERE cliente_id = ?
            ORDER BY fecha DESC
            LIMIT ?
        `;
        return query(sql, [clienteId, limit]);
    }
}
