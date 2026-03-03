import { db } from "../connect.js";

const query = (sql: string, values?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error: any, results: any) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

export class RoutineAssignModel {
    static async assignToClient(clienteId: number, rutinaId: number, instructorId: number, observaciones?: string) {
        const sql = `
            INSERT INTO rutina_asignada (cliente_id, rutina_id, instructor_id, fecha_asignacion, observaciones)
            VALUES (?, ?, ?, CURDATE(), ?)
        `;
        const result: any = await query(sql, [clienteId, rutinaId, instructorId, observaciones || null]);
        return result.insertId;
    }

    static async getByClient(clienteId: number) {
        const sql = `
            SELECT 
                ra.id, ra.cliente_id, ra.rutina_id, ra.instructor_id, 
                ra.fecha_asignacion, ra.observaciones, ra.activa, ra.created_at,
                r.descripcion AS rutina_nombre,
                CONCAT(p.nombre, ' ', p.apellido) AS instructor_nombre
            FROM rutina_asignada ra
            JOIN rutina r ON ra.rutina_id = r.id
            JOIN user u ON ra.instructor_id = u.id
            JOIN persona p ON u.persona_id = p.id
            WHERE ra.cliente_id = ?
            ORDER BY ra.fecha_asignacion DESC
        `;
        return query(sql, [clienteId]);
    }

    static async getActiveByClient(clienteId: number) {
        const sql = `
            SELECT 
                ra.id, ra.cliente_id, ra.rutina_id, ra.instructor_id, 
                ra.fecha_asignacion, ra.observaciones, ra.activa,
                r.descripcion AS rutina_nombre
            FROM rutina_asignada ra
            JOIN rutina r ON ra.rutina_id = r.id
            WHERE ra.cliente_id = ? AND ra.activa = TRUE
            ORDER BY ra.fecha_asignacion DESC
            LIMIT 1
        `;
        return query(sql, [clienteId]);
    }

    static async getAllAssignments(filters?: { cliente_id?: number; instructor_id?: number; activa?: boolean }) {
        let sql = `
            SELECT 
                ra.id, ra.cliente_id, ra.rutina_id, ra.instructor_id, 
                ra.fecha_asignacion, ra.observaciones, ra.activa, ra.created_at,
                r.descripcion AS rutina_nombre,
                CONCAT(c.nombre, ' ', c.apellido) AS cliente_nombre,
                CONCAT(i.nombre, ' ', i.apellido) AS instructor_nombre
            FROM rutina_asignada ra
            JOIN rutina r ON ra.rutina_id = r.id
            JOIN user uc ON ra.cliente_id = uc.id
            JOIN persona c ON uc.persona_id = c.id
            JOIN user ui ON ra.instructor_id = ui.id
            JOIN persona i ON ui.persona_id = i.id
            WHERE 1=1
        `;
        
        const params: any[] = [];
        
        if (filters?.cliente_id) {
            sql += ' AND ra.cliente_id = ?';
            params.push(filters.cliente_id);
        }
        
        if (filters?.instructor_id) {
            sql += ' AND ra.instructor_id = ?';
            params.push(filters.instructor_id);
        }
        
        if (filters?.activa !== undefined) {
            sql += ' AND ra.activa = ?';
            params.push(filters.activa);
        }
        
        sql += ' ORDER BY ra.fecha_asignacion DESC';
        
        return query(sql, params);
    }

    static async deactivate(id: number) {
        await query('UPDATE rutina_asignada SET activa = FALSE WHERE id = ?', [id]);
        return { message: 'Rutina desactivada' };
    }

    static async delete(id: number) {
        await query('DELETE FROM rutina_asignada WHERE id = ?', [id]);
        return { message: 'Asignación eliminada' };
    }
}
