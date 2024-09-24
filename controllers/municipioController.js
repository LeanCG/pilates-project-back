import util from "util";
import {db} from "../connect.js";

const query = util.promisify(db.query).bind(db);


export const getMunicipio = async (req, res) =>{
    try{
    let localidades = await query("SELECT * FROM municipio");
    if (!localidades){
        console.log("esta vacio")
    }else{
        res.json(localidades)
    }
    }catch(error){
        console.error("error en la query",error.message);
        return res.status(500).json({message: "error en la base de datos"})
    }
}