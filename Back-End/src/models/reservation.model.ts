import { db } from "../connect.js";

const query = (sql: string, values?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error: any, results: any) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

export class ReservationModel {
    static async getAll(filters?: { cliente_id?: number; estado?: string; fecha?: string }) {
        let sql = `
        SELECT 
            r.id, r.estado, r.fecha_reserva, r.confirmacion_asistencia, r.cancelacion, r.motivo_cancelacion,
            t.fecha AS turno_fecha, t.hora AS turno_hora, t.actividad,
            u.id AS cliente_id,
            CONCAT(p.nombre, ' ', p.apellido) AS cliente_nombre,
            e.id AS instructor_id,
            CONCAT(ep.nombre, ' ', ep.apellido) AS instructor_nombre
        FROM reserva r
        JOIN turno t ON r.turno_id = t.id
        JOIN user u ON r.cliente_id = u.id
        JOIN persona p ON u.persona_id = p.id
        JOIN empleado e ON t.instructor_id = e.id
        JOIN persona ep ON e.persona_id = ep.id
        WHERE 1=1
        `;
        
        const params: any[] = [];
        
        if (filters?.cliente_id) {
            sql += ' AND r.cliente_id = ?';
            params.push(filters.cliente_id);
        }
        
        if (filters?.estado) {
            sql += ' AND r.estado = ?';
            params.push(filters.estado);
        }
        
        if (filters?.fecha) {
            sql += ' AND t.fecha = ?';
            params.push(filters.fecha);
        }
        
        sql += ' ORDER BY t.fecha ASC, t.hora ASC';
        
        return query(sql, params);
    }

    static async getById(id: number) {
        const sql = `
        SELECT 
            r.id, r.estado, r.fecha_reserva, r.confirmacion_asistencia, r.cancelacion, r.motivo_cancelacion,
            t.fecha AS turno_fecha, t.hora AS turno_hora, t.actividad, t.capacidad,
            u.id AS cliente_id,
            CONCAT(p.nombre, ' ', p.apellido) AS cliente_nombre,
            (SELECT COUNT(*) FROM reserva r2 WHERE r2.turno_id = t.id AND r2.estado NOT IN ('cancelada')) AS reservas_count
        FROM reserva r
        JOIN turno t ON r.turno_id = t.id
        JOIN user u ON r.cliente_id = u.id
        JOIN persona p ON u.persona_id = p.id
        WHERE r.id = ?
        `;
        return query(sql, [id]);
    }

    static async create(clienteId: number, turnoId: number) {
        // Validar turno existe y tiene cupo
        const turnoRows: any = await query(
            `SELECT t.*, 
                (SELECT COUNT(*) FROM reserva r WHERE r.turno_id = t.id AND r.estado NOT IN ('cancelada')) AS reservas_count
            FROM turno t WHERE t.id = ? AND t.estado_id = 1`,
            [turnoId]
        );
        const turno = turnoRows[0];
        
        if (!turno) {
            throw new Error('Turno no encontrado o inactivo');
        }
        
        if (turno.reservas_count >= turno.capacidad) {
            throw new Error('Cupo agotado para este turno');
        }

        // Validar que el cliente puede reservar (plan y morosidad)
        const clienteRows: any = await query(
            `SELECT u.*, p.nombre, p.apellido FROM user u 
             JOIN persona p ON u.persona_id = p.id 
             WHERE u.id = ?`,
            [clienteId]
        );
        const cliente = clienteRows[0];

        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }

        // Validar límite semanal según plan
        if (cliente.plan_id) {
            const planRows: any = await query(
                'SELECT limite_semanal FROM plan WHERE id = ?',
                [cliente.plan_id]
            );
            const plan = planRows[0];
            
            if (plan) {
                const inicioSemana = new Date();
                inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
                inicioSemana.setHours(0, 0, 0, 0);
                
                const finSemana = new Date(inicioSemana);
                finSemana.setDate(finSemana.getDate() + 6);
                
                const reservasSemanaRows: any = await query(
                    `SELECT COUNT(*) as count FROM reserva r
                     JOIN turno t ON r.turno_id = t.id
                     WHERE r.cliente_id = ? AND r.estado NOT IN ('cancelada')
                     AND t.fecha BETWEEN ? AND ?`,
                    [clienteId, inicioSemana.toISOString().split('T')[0], finSemana.toISOString().split('T')[0]]
                );
                const reservasSemana = reservasSemanaRows[0];
                
                if (reservasSemana.count >= plan.limite_semanal) {
                    throw new Error(`Límite semanal de ${plan.limite_semanal} reservas alcanzado para tu plan`);
                }
            }
        }

        // Verificar si el cliente ya tiene reserva para este turno
        const reservaExistenteRows: any = await query(
            'SELECT id FROM reserva WHERE cliente_id = ? AND turno_id = ? AND estado NOT IN ("cancelada")',
            [clienteId, turnoId]
        );
        const reservaExistente = reservaExistenteRows[0];
        
        if (reservaExistente) {
            throw new Error('Ya tienes una reserva para este turno');
        }

        const result: any = await query(
            'INSERT INTO reserva (cliente_id, turno_id, estado) VALUES (?, ?, "pendiente")',
            [clienteId, turnoId]
        );

        return result.insertId;
    }

    static async confirm(id: number, clienteId: number) {
        const reservaRows: any = await query(
            `SELECT r.*, t.fecha, t.hora 
             FROM reserva r 
             JOIN turno t ON r.turno_id = t.id 
             WHERE r.id = ? AND r.cliente_id = ?`,
            [id, clienteId]
        );
        const reserva = reservaRows[0];
        
        if (!reserva) {
            throw new Error('Reserva no encontrada');
        }
        
        if (reserva.estado === 'confirmada') {
            throw new Error('Reserva ya confirmada');
        }
        
        if (reserva.estado === 'cancelada') {
            throw new Error('Reserva cancelada');
        }

        // Validar ventana de 30 minutos
        const ahora = new Date();
        const fechaTurno = new Date(`${reserva.fecha} ${reserva.hora}`);
        const diffMs = fechaTurno.getTime() - ahora.getTime();
        const diffMin = diffMs / (1000 * 60);
        
        if (diffMin < 30) {
            throw new Error('Tiempo de confirmación vencido (mínimo 30 minutos antes)');
        }

        await query(
            'UPDATE reserva SET estado = "confirmada", confirmacion_asistencia = NOW() WHERE id = ?',
            [id]
        );

        return { message: 'Asistencia confirmada' };
    }

    static async cancel(id: number, clienteId: number, motivo?: string) {
        const reservaRows: any = await query(
            `SELECT r.*, t.fecha, t.hora 
             FROM reserva r 
             JOIN turno t ON r.turno_id = t.id 
             WHERE r.id = ? AND r.cliente_id = ?`,
            [id, clienteId]
        );
        const reserva = reservaRows[0];
        
        if (!reserva) {
            throw new Error('Reserva no encontrada');
        }
        
        if (reserva.estado === 'cancelada') {
            throw new Error('Reserva ya cancelada');
        }

        // Validar ventana de 1 hora
        const ahora = new Date();
        const fechaTurno = new Date(`${reserva.fecha} ${reserva.hora}`);
        const diffMs = fechaTurno.getTime() - ahora.getTime();
        const diffMin = diffMs / (1000 * 60);
        
        if (diffMin < 60) {
            // Cancelación tardía - podría aplicar multa
            await query(
                'UPDATE reserva SET estado = "cancelada", cancelacion = NOW(), motivo_cancelacion = ? WHERE id = ?',
                [`Cancelación tardía. ${motivo || ''}`, id]
            );
            return { message: 'Reserva cancelada (tardía)', advertencia: 'Aplicó multa por cancelación tardía' };
        }

        await query(
            'UPDATE reserva SET estado = "cancelada", cancelacion = NOW(), motivo_cancelacion = ? WHERE id = ?',
            [motivo || 'Cancelación por cliente', id]
        );

        return { message: 'Reserva cancelada' };
    }
}
