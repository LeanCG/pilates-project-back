import { error } from "console";
import {db} from "../connect.js";
import util from "util";
const query = util.promisify(db.query).bind(db);

//Listar ejercicios
export const getExcercises = async (req,res) => {
let exercise = await query("SELECT * FROM  ejercicio;");
 if (!exercise){
    console.log("esta vacio");
 }else {
    console.log("/api/excercise/exercise/304");
    res.json(exercise)
 }
} 

//Crear ejercicios
export const createExcercise = async (req,res) => {
    const {descripcion,observacion= null,grupo_muscular=null,url_video=null,calorias_promedio=null,nivel_dificultad=null} = req.body;
    if (!descripcion){
        return res.status(400).json({error: "el campo es requerido"});
    }
    try {
        const sql = 'INSERT INTO ejercicio (descripcion, observacion, grupo_muscular, url_video, calorias_promedio, nivel_dificultad) VALUES (?, ?, ?, ?, ?, ?)';
        const result = await query(sql, [descripcion, observacion, grupo_muscular, url_video, calorias_promedio, nivel_dificultad]);
        res.status(201).json({ id: result.insertId, descripcion, observacion, grupo_muscular, url_video, calorias_promedio, nivel_dificultad });
    } catch (err) {
        // Manejar errores en caso de que la consulta falle
        res.status(500).json({ error: err.message });
    }
}

// Eliminar un ejercicio
export const deleteExcercise = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "El ID del ejercicio es requerido" });
    }

    try {
        const sql = 'DELETE FROM ejercicio WHERE id = ?';
        const result = await query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Ejercicio no encontrado" });
        }

        res.status(200).json({ message: "Ejercicio eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Modificar Ejercicio

export const updateExcercise = async (req, res) => {
    const { id } = req.params;
    const { descripcion, observacion, grupo_muscular, url_video, calorias_promedio, nivel_dificultad } = req.body;

    if (!id) { 
        return res.status(400).json({ error: "El id del ejercicio es requerido" });
    }

    try {
        const sql = `
            UPDATE ejercicio
            SET descripcion = ?, observacion = ?, grupo_muscular = ?, url_video = ?, calorias_promedio = ?, nivel_dificultad = ?
            WHERE id = ?
        `;
        const result = await query(sql, [descripcion, observacion, grupo_muscular, url_video, calorias_promedio, nivel_dificultad, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Ejercicio no encontrado" });
        }

        res.status(200).json({ message: "Ejercicio modificado correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};