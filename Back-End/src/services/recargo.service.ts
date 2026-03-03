import { db } from "../connect.js";

const query = (sql: string, values?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (error: any, results: any) => {
            if (error) return reject(error);
            resolve(results);
        });
    });
};

export class RecargoService {
    static async getConfig() {
        const configRows: any = await query(
            'SELECT * FROM config_recargo WHERE activo = TRUE LIMIT 1'
        );
        return configRows[0] || null;
    }

    static async aplicarRecargos() {
        console.log('🔄 Iniciando proceso de recargo automático...');
        
        const config = await this.getConfig();
        if (!config) {
            console.log('⚠️  No hay configuración de recargo activa');
            return { message: 'No hay configuración de recargo activa' };
        }

        const hoy = new Date();
        const diaActual = hoy.getDate();
        
        if (diaActual < config.dia_aplicacion) {
            console.log(`⏳ No aplica recargo: día ${diaActual} < día ${config.dia_aplicacion}`);
            return { message: 'No aplica recargo aún' };
        }

        const usuariosConPlan: any = await query(`
            SELECT u.id as user_id, u.plan_id, p.nombre as plan_nombre, p.precio
            FROM user u
            JOIN plan p ON u.plan_id = p.id
            WHERE u.plan_id IS NOT NULL AND u.tipo_estado_id = 1
        `);

        if (!usuariosConPlan || usuariosConPlan.length === 0) {
            console.log('ℹ️  No hay usuarios con plan activo');
            return { message: 'No hay usuarios con plan' };
        }

        let recargosAplicados = 0;
        const montoRecargo = (config.porcentaje / 100);

        for (const usuario of usuariosConPlan) {
            const deudaExistenteRows: any = await query(`
                SELECT id FROM deuda 
                WHERE cliente_id = ? AND estado = 'pendiente' 
                AND MONTH(fecha_vencimiento) = MONTH(CURDATE()) 
                AND YEAR(fecha_vencimiento) = YEAR(CURDATE())
            `, [usuario.user_id]);
            const deudaExistente = deudaExistenteRows[0];

            if (deudaExistente) {
                continue;
            }

            const precioPlan = parseFloat(usuario.precio);
            const montoRecargado = precioPlan * (1 + montoRecargo);
            const intereses = precioPlan * montoRecargo;

            const fechaVencimiento = new Date();
            fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 1);
            fechaVencimiento.setDate(config.dia_aplicacion);

            await query(`
                INSERT INTO deuda (cliente_id, monto, monto_original, intereses, fecha_vencimiento, estado)
                VALUES (?, ?, ?, ?, ?, 'pendiente')
            `, [usuario.user_id, montoRecargado, precioPlan, intereses, fechaVencimiento.toISOString().split('T')[0]]);

            recargosAplicados++;
            console.log(`✅ Recargo aplicado a usuario ${usuario.user_id}: $${precioPlan} + ${config.porcentaje}% = $${montoRecargado}`);
        }

        console.log(`🎉 Proceso completado: ${recargosAplicados} recargos aplicados`);
        return { 
            message: 'Recargos aplicados correctamente',
            recargosAplicados,
            config
        };
    }

    static async actualizarConfig(nuevaConfig: { dia_aplicacion?: number; porcentaje?: number; tipo_interes?: string; activo?: boolean }) {
        const updates: string[] = [];
        const values: any[] = [];

        if (nuevaConfig.dia_aplicacion !== undefined) {
            updates.push('dia_aplicacion = ?');
            values.push(nuevaConfig.dia_aplicacion);
        }
        if (nuevaConfig.porcentaje !== undefined) {
            updates.push('porcentaje = ?');
            values.push(nuevaConfig.porcentaje);
        }
        if (nuevaConfig.tipo_interes !== undefined) {
            updates.push('tipo_interes = ?');
            values.push(nuevaConfig.tipo_interes);
        }
        if (nuevaConfig.activo !== undefined) {
            updates.push('activo = ?');
            values.push(nuevaConfig.activo);
        }

        if (updates.length === 0) {
            throw new Error('No hay valores para actualizar');
        }

        await query(`UPDATE config_recargo SET ${updates.join(', ')} WHERE id = 1`, values);
        return { message: 'Configuración actualizada' };
    }

    static startScheduler(intervalMs: number = 1000 * 60 * 60) {
        const run = async () => {
            try {
                await RecargoService.aplicarRecargos();
            } catch (error) {
                console.error('Error en scheduler de recargos:', error);
            }
        };

        void run();
        setInterval(run, intervalMs);
    }
}
