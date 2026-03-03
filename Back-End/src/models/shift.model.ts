import { db } from "../connect.js";

const query = (sql: string, values?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error: any, results: any) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

export class ShiftModel {
    static async getAll(filters?: { fecha?: string; instructor_id?: number }) {
        let sql = `
        SELECT 
            t.id, t.fecha, t.hora, t.actividad, t.capacidad, t.estado_id,
            e.id AS instructor_id,
            CONCAT(p.nombre, ' ', p.apellido) AS instructor_nombre,
            tp.descripcion AS tipo_pilates,
            (SELECT COUNT(*) FROM reserva r WHERE r.turno_id = t.id AND r.estado NOT IN ('cancelada')) AS reservas_count,
            (t.capacidad - COALESCE((SELECT COUNT(*) FROM reserva r WHERE r.turno_id = t.id AND r.estado NOT IN ('cancelada')), 0)) AS cupo_disponible
        FROM turno t
        JOIN empleado e ON t.instructor_id = e.id
        JOIN persona p ON e.persona_id = p.id
        LEFT JOIN tipo_pilates tp ON t.tipo_pilates_id = tp.id
        WHERE 1=1
        `;
        
        const params: any[] = [];
        
        if (filters?.fecha) {
            sql += ' AND t.fecha = ?';
            params.push(filters.fecha);
        }
        
        if (filters?.instructor_id) {
            sql += ' AND t.instructor_id = ?';
            params.push(filters.instructor_id);
        }
        
        sql += ' ORDER BY t.fecha ASC, t.hora ASC';
        
        return query(sql, params);
    }

    static async getById(id: number) {
        const sql = `
        SELECT 
            t.id, t.fecha, t.hora, t.actividad, t.capacidad, t.estado_id,
            e.id AS instructor_id,
            CONCAT(p.nombre, ' ', p.apellido) AS instructor_nombre,
            tp.descripcion AS tipo_pilates,
            (t.capacidad - COALESCE((SELECT COUNT(*) FROM reserva r WHERE r.turno_id = t.id AND r.estado NOT IN ('cancelada')), 0)) AS cupo_disponible
        FROM turno t
        JOIN empleado e ON t.instructor_id = e.id
        JOIN persona p ON e.persona_id = p.id
        LEFT JOIN tipo_pilates tp ON t.tipo_pilates_id = tp.id
        WHERE t.id = ?
        `;
        return query(sql, [id]);
    }

    static async getAvailable(fecha?: string) {
        let sql = `
        SELECT 
            t.id, t.fecha, t.hora, t.actividad, t.capacidad,
            e.id AS instructor_id,
            CONCAT(p.nombre, ' ', p.apellido) AS instructor_nombre,
            tp.descripcion AS tipo_pilates,
            (t.capacidad - COALESCE((SELECT COUNT(*) FROM reserva r WHERE r.turno_id = t.id AND r.estado NOT IN ('cancelada')), 0)) AS cupo_disponible
        FROM turno t
        JOIN empleado e ON t.instructor_id = e.id
        JOIN persona p ON e.persona_id = p.id
        LEFT JOIN tipo_pilates tp ON t.tipo_pilates_id = tp.id
        WHERE t.estado_id = 1
        AND t.fecha >= CURDATE()
        `;
        
        const params: any[] = [];
        
        if (fecha) {
            sql += ' AND t.fecha = ?';
            params.push(fecha);
        }
        
        sql += ` AND (t.capacidad - COALESCE((SELECT COUNT(*) FROM reserva r WHERE r.turno_id = t.id AND r.estado NOT IN ('cancelada')), 0)) > 0`;
        sql += ' ORDER BY t.fecha ASC, t.hora ASC';
        
        return query(sql, params);
    }

    static async create(data: {
        fecha: string;
        hora: string;
        instructor_id: number;
        actividad: string;
        tipo_pilates_id?: number;
        capacidad?: number;
    }) {
        // Validar fecha no sea pasado
        const fechaTurno = new Date(data.fecha);
        const ahora = new Date();
        ahora.setHours(0, 0, 0, 0);
        
        if (fechaTurno < ahora) {
            throw new Error('No se puede crear un turno en el pasado');
        }

        // Validar conflicto de instructor
        const conflictoRows: any = await query(
            `SELECT id FROM turno WHERE instructor_id = ? AND fecha = ? AND hora = ? AND estado_id = 1`,
            [data.instructor_id, data.fecha, data.hora]
        );
        const conflicto = conflictoRows[0];
        
        if (conflicto) {
            throw new Error('El instructor ya tiene un turno asignado en este horario');
        }

        const result: any = await query(
            `INSERT INTO turno (fecha, hora, instructor_id, actividad, tipo_pilates_id, capacidad, estado_id) 
             VALUES (?, ?, ?, ?, ?, ?, 1)`,
            [
                data.fecha,
                data.hora,
                data.instructor_id,
                data.actividad,
                data.tipo_pilates_id || null,
                data.capacidad || 10
            ]
        );

        return result.insertId;
    }

    static async update(id: number, data: {
        fecha?: string;
        hora?: string;
        instructor_id?: number;
        actividad?: string;
        tipo_pilates_id?: number;
        capacidad?: number;
        estado_id?: number;
    }) {
        // Validar fecha no sea pasado si se actualiza
        if (data.fecha) {
            const fechaTurno = new Date(data.fecha);
            const ahora = new Date();
            ahora.setHours(0, 0, 0, 0);
            
            if (fechaTurno < ahora) {
                throw new Error('No se puede mover un turno a una fecha pasada');
            }
        }

        await query(
            `UPDATE turno SET 
                fecha = COALESCE(?, fecha),
                hora = COALESCE(?, hora),
                instructor_id = COALESCE(?, instructor_id),
                actividad = COALESCE(?, actividad),
                tipo_pilates_id = COALESCE(?, tipo_pilates_id),
                capacidad = COALESCE(?, capacidad),
                estado_id = COALESCE(?, estado_id)
            WHERE id = ?`,
            [
                data.fecha,
                data.hora,
                data.instructor_id,
                data.actividad,
                data.tipo_pilates_id,
                data.capacidad,
                data.estado_id,
                id
            ]
        );

        return { message: 'Turno actualizado' };
    }

    static async delete(id: number) {
        // Verificar si hay reservas
        const reservasRows: any = await query(
            'SELECT COUNT(*) as count FROM reserva WHERE turno_id = ? AND estado NOT IN ("cancelada")',
            [id]
        );
        const reservas = reservasRows[0];
        
        if (reservas && reservas.count > 0) {
            throw new Error('No se puede eliminar un turno con reservas activas');
        }

        await query('DELETE FROM turno WHERE id = ?', [id]);
        return { message: 'Turno eliminado' };
    }
}
