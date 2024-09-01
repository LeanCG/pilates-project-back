import { db } from "../connect.js";
import util from "util";
const query = util.promisify(db.query).bind(db);


export const getRoutines = async (req, res) => {
    try {
        const sql = 'SELECT * FROM rutina';
        const routines = await query(sql);
        
        if (routines.length === 0) {
            return res.status(404).json({ error: "No se encontraron rutinas" });
        }

        res.status(200).json(routines);
    } catch (err) {
        console.error("Error al obtener rutinas:", err.message);
        res.status(500).json({ error: err.message });
    }
};


