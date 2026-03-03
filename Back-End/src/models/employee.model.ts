import { db } from "../connect.js";

const query = (sql: string, values?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error: any, results: any) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

export class EmployeeModel {
    static async getAll() {
        const sql = `
        SELECT 
            e.id, e.cargo, e.especialidad, e.fecha_contratacion, e.estado_id,
            p.nombre, p.apellido, p.dni, p.cuil,
            d.descripcion AS direccion,
            m.descripcion AS municipio,
            te.descripcion AS estado
        FROM empleado e
        JOIN persona p ON e.persona_id = p.id
        LEFT JOIN direccion d ON p.direccion_id = d.id
        LEFT JOIN municipio m ON d.municipio_id = m.id
        LEFT JOIN tipo_estado te ON e.estado_id = te.id
        ORDER BY e.id DESC
        `;
        return query(sql);
    }

    static async getById(id: number) {
        const sql = `
        SELECT 
            e.id, e.cargo, e.especialidad, e.fecha_contratacion, e.estado_id,
            p.nombre, p.apellido, p.dni, p.cuil, p.enfermedades, p.cirugias, p.limitaciones,
            d.descripcion AS direccion,
            m.id AS municipio_id,
            te.descripcion AS estado
        FROM empleado e
        JOIN persona p ON e.persona_id = p.id
        LEFT JOIN direccion d ON p.direccion_id = d.id
        LEFT JOIN municipio m ON d.municipio_id = m.id
        LEFT JOIN tipo_estado te ON e.estado_id = te.id
        WHERE e.id = ?
        `;
        return query(sql, [id]);
    }

    static async create(data: {
        nombre: string;
        apellido: string;
        dni: string;
        cuil: string;
        direccion: string;
        municipio_id: number;
        cargo: string;
        especialidad?: string;
        fecha_contratacion: string;
    }) {
        // Crear dirección
        const direccionResult: any = await query(
            'INSERT INTO direccion (descripcion, municipio_id) VALUES (?, ?)',
            [data.direccion, data.municipio_id]
        );
        const direccionId = direccionResult.insertId;

        // Crear persona
        const personaResult: any = await query(
            'INSERT INTO persona (nombre, apellido, dni, cuil, direccion_id, tipo_persona_id) VALUES (?, ?, ?, ?, ?, ?)',
            [data.nombre, data.apellido, data.dni, data.cuil, direccionId, 1]
        );
        const personaId = personaResult.insertId;

        // Crear empleado
        const empleadoResult: any = await query(
            'INSERT INTO empleado (persona_id, cargo, especialidad, fecha_contratacion, estado_id) VALUES (?, ?, ?, ?, 1)',
            [personaId, data.cargo, data.especialidad || null, data.fecha_contratacion]
        );

        return empleadoResult.insertId;
    }

    static async update(id: number, data: {
        nombre?: string;
        apellido?: string;
        dni?: string;
        cuil?: string;
        direccion?: string;
        municipio_id?: number;
        cargo?: string;
        especialidad?: string;
        estado_id?: number;
    }) {
        const empleadoRows: any = await query(
            'SELECT persona_id FROM empleado WHERE id = ?',
            [id]
        );
        const empleado = empleadoRows[0];
        
        if (!empleado) throw new Error('Empleado no encontrado');

        if (data.nombre || data.apellido || data.dni || data.cuil) {
            await query(
                `UPDATE persona SET 
                    nombre = COALESCE(?, nombre),
                    apellido = COALESCE(?, apellido),
                    dni = COALESCE(?, dni),
                    cuil = COALESCE(?, cuil)
                WHERE id = ?`,
                [data.nombre, data.apellido, data.dni, data.cuil, empleado.persona_id]
            );
        }

        if (data.cargo || data.especialidad || data.estado_id) {
            await query(
                `UPDATE empleado SET 
                    cargo = COALESCE(?, cargo),
                    especialidad = COALESCE(?, especialidad),
                    estado_id = COALESCE(?, estado_id)
                WHERE id = ?`,
                [data.cargo, data.especialidad, data.estado_id, id]
            );
        }

        return { message: 'Empleado actualizado' };
    }

    static async delete(id: number) {
        await query('UPDATE empleado SET estado_id = 2 WHERE id = ?', [id]);
        return { message: 'Empleado dado de baja' };
    }

    static async getInstructors() {
        const sql = `
        SELECT e.id, p.nombre, p.apellido, e.especialidad
        FROM empleado e
        JOIN persona p ON e.persona_id = p.id
        WHERE e.estado_id = 1 AND e.cargo = 'Instructor'
        `;
        return query(sql);
    }
}
