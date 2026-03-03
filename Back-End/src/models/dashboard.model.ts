import { db } from "../connect.js";
import util from "util";

const query = util.promisify(db.query).bind(db);

export class DashboardModel {
    static async getMetrics() {
        const sqlQuery = `
        SELECT 
            (SELECT COUNT(*) FROM turnos_alta_usuario WHERE tipo_estado_id = 1) AS turnos,
            (SELECT COALESCE(SUM(df.precio), 0) FROM cabecera_factura cf 
             JOIN detalle_factura df ON cf.id = df.cabecera_factura_id 
             WHERE MONTH(cf.fecha_factura) = MONTH(CURDATE()) AND YEAR(cf.fecha_factura) = YEAR(CURDATE())) AS ingresos,
            (SELECT COUNT(*) FROM user WHERE tipo_estado_id = 1 AND rol_id = 2) AS clientes,
            (SELECT COUNT(*) FROM rutina WHERE tipo_estado_id = 1) AS rutinas
        `;
        return query(sqlQuery);
    }
}
