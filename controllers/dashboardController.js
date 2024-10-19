import { db } from "../connect.js";
import util from "util";
const query = util.promisify(db.query).bind(db);

export const getDashboard= async (req,res) =>{
    query = `SELECT 
    CASE
	    WHEN HOUR(hora) = 8 THEN '8:00 - 8:59'
	    WHEN HOUR(hora) = 9 THEN '9:00 - 9:59'
	    WHEN HOUR(hora) = 10 THEN '10:00 - 10:59'
	    WHEN HOUR(hora) = 11 THEN '11:00 - 11:59'
	    WHEN HOUR(hora) = 16 THEN '16:00 - 16:59'
	    WHEN HOUR(hora) = 17 THEN '17:00 - 17:59'
	    WHEN HOUR(hora) = 18 THEN '18:00 - 18:59'
	    WHEN HOUR(hora) = 19 THEN '19:00 - 19:59'
        WHEN HOUR(hora) = 20 THEN '20:00 - 20:59'
        WHEN HOUR(hora) = 21 THEN '21:00 - 21:59'
        WHEN HOUR(hora) = 11 THEN '11:00 - 11:59'
        -- Agrega más rangos si es necesario
    END AS turno,
    COUNT(*) AS cantidad
FROM 
    turnos_alta_usuario tau 
GROUP BY 
    turno;`

    let dashboard = await query(query);
    if (!dashboard){
       console.log("esta vacio");
    }else {
       console.log("/api/excercise/exercise/304");
       res.json(dashboard)
    }
}

