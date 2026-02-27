import { db } from "../connect.js";
import util from "util";

const query = util.promisify(db.query).bind(db);

export class DashboardModel {
    static async getMetrics() {
        const sqlQuery = `
      SELECT 
        t.turno,
        COALESCE(tau.cantidad, 0) AS cantidad
      FROM (
        SELECT '8:00' AS turno, 8 AS hora UNION ALL
        SELECT '9:00', 9 UNION ALL
        SELECT '10:00', 10 UNION ALL
        SELECT '11:00', 11 UNION ALL
        SELECT '16:00', 16 UNION ALL
        SELECT '17:00', 17 UNION ALL
        SELECT '18:00', 18 UNION ALL
        SELECT '19:00', 19 UNION ALL
        SELECT '20:00', 20 UNION ALL
        SELECT '21:00', 21 UNION ALL
        SELECT '22:00', 22
      ) AS t
      LEFT JOIN (
        SELECT 
            HOUR(hora) AS hora,
            COUNT(*) AS cantidad
        FROM turnos_alta_usuario tau 
        GROUP BY HOUR(hora)
      ) tau ON t.hora = tau.hora
      ORDER BY t.hora;
    `;
        return query(sqlQuery);
    }
}
