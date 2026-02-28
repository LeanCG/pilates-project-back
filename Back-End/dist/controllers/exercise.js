import { ExerciseModel } from "../models/exercise.model.js";
// Listar ejercicios
/**
 * Retrieves all exercises from the database.
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const getExcercises = async (req, res) => {
    try {
        const exercises = await ExerciseModel.getExercises();
        if (!exercises) {
            console.log("esta vacio");
        }
        else {
            res.json(exercises);
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Crear ejercicios
/**
 * Creates a new exercise in the system.
 * @param req - Express request object with exercise details in body.
 * @param res - Express response object.
 */
export const createExcercise = async (req, res) => {
    const { descripcion, observacion = null, grupo_muscular = null, url_video = null, calorias_promedio = null, nivel_dificultad = null } = req.body;
    if (!descripcion) {
        return res.status(400).json({ error: "El campo descripcion es requerido" });
    }
    try {
        const result = await ExerciseModel.createExercise({
            descripcion, observacion, grupo_muscular, url_video, calorias_promedio, nivel_dificultad
        });
        res.status(201).json({ id: result.insertId, descripcion, observacion, grupo_muscular, url_video, calorias_promedio, nivel_dificultad });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Eliminar un ejercicio
/**
 * Deletes an exercise by its ID.
 * @param req - Express request object with exercise ID in params.
 * @param res - Express response object.
 */
export const deleteExcercise = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "El ID del ejercicio es requerido" });
    }
    try {
        const result = await ExerciseModel.deleteExercise(Number(id));
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Ejercicio no encontrado" });
        }
        res.status(200).json({ message: "Ejercicio eliminado correctamente" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Modificar Ejercicio
/**
 * Updates an existing exercise's details.
 * @param req - Express request object with exercise ID in params and updated data in body.
 * @param res - Express response object.
 */
export const updateExcercise = async (req, res) => {
    const { id } = req.params;
    const { descripcion, observacion, grupo_muscular, url_video, calorias_promedio, nivel_dificultad } = req.body;
    if (!id) {
        return res.status(400).json({ error: "El id del ejercicio es requerido" });
    }
    try {
        const result = await ExerciseModel.updateExercise(Number(id), {
            descripcion, observacion, grupo_muscular, url_video, calorias_promedio, nivel_dificultad
        });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Ejercicio no encontrado" });
        }
        res.status(200).json({ message: "Ejercicio modificado correctamente" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
