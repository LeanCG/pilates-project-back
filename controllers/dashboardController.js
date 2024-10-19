import { db } from "../connect.js";
import util from "util";
const query = util.promisify(db.query).bind(db);

export const getDashboard = async (req,res) =>{
try{
    const sqlQuery = `
    SELECT CASE
	    WHEN HOUR(hora) = 8 THEN '8:00'
	    WHEN HOUR(hora) = 9 THEN '9:00'
	    WHEN HOUR(hora) = 10 THEN '10:00'
	    WHEN HOUR(hora) = 11 THEN '11:00'
	    WHEN HOUR(hora) = 16 THEN '16:00'
	    WHEN HOUR(hora) = 17 THEN '17:00'
	    WHEN HOUR(hora) = 18 THEN '18:00'
	    WHEN HOUR(hora) = 19 THEN '19:00'
        WHEN HOUR(hora) = 20 THEN '20:00'
        WHEN HOUR(hora) = 21 THEN '21:00'
        WHEN HOUR(hora) = 22 THEN '22:00'
        -- Agrega más rangos si es necesario
    END AS turno,
    COUNT(*) AS cantidad
    FROM 
    turnos_alta_usuario tau 
    GROUP BY 
    turno
    ORDER BY turno DESC;`
    let dashboard = await query(sqlQuery);
    if (!dashboard || dashboard.length == 0){
       console.log("esta vacio");
       return res.status(404).json({message: "Error dashboard not found"})
    }
    console.log("/api/excercise/exercise/304");
    return res.status(200).json(dashboard)
}
catch(error){
    res.status(500).json({message: "Error internal server error"})
    console.error(error)  
}
}

