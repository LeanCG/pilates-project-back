import {db} from "../connect.js"
import util from "util"
const query = util.promisify(db.query).bind(db);

export const getRol = async (req, res) => {
try{
    const roles = await query("SELECT * FROM rol;");

    if(!roles || roles.length === 0){
        return res.status(404).json({ error: "No se encontraron roles" });
    }else{
        
        res.status(200).json(roles);
    }
}
catch(error){
    console.error("error:", error.message);
    return res.status(500).json({message: error.message});
}
}