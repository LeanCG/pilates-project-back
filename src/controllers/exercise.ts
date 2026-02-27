import express from "express";
import { ExerciseModel } from "../models/exercise.model.js";

// Listar ejercicios
export const getExcercises = async (req: express.Request, res: express.Response) => {
    try {
        const exercises: any = await ExerciseModel.getExercises();
        if (!exercises) {
            console.log("esta vacio");
        } else {
            res.json(exercises);
        }
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

// Crear ejercicios
export const createExcercise = async (req: express.Request, res: express.Response) => {
    const { descripcion, observacion = null, grupo_muscular = null, url_video = null, calorias_promedio = null, nivel_dificultad = null } = req.body;

    if (!descripcion) {
        return res.status(400).json({ error: "El campo descripcion es requerido" });
    }

    try {
        const result: any = await ExerciseModel.createExercise({
            descripcion, observacion, grupo_muscular, url_video, calorias_promedio, nivel_dificultad
        });
        res.status(201).json({ id: result.insertId, descripcion, observacion, grupo_muscular, url_video, calorias_promedio, nivel_dificultad });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

// Eliminar un ejercicio
export const deleteExcercise = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "El ID del ejercicio es requerido" });
    }

    try {
        const result: any = await ExerciseModel.deleteExercise(Number(id));

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Ejercicio no encontrado" });
        }

        res.status(200).json({ message: "Ejercicio eliminado correctamente" });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

// Modificar Ejercicio
export const updateExcercise = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { descripcion, observacion, grupo_muscular, url_video, calorias_promedio, nivel_dificultad } = req.body;

    if (!id) {
        return res.status(400).json({ error: "El id del ejercicio es requerido" });
    }

    try {
        const result: any = await ExerciseModel.updateExercise(Number(id), {
            descripcion, observacion, grupo_muscular, url_video, calorias_promedio, nivel_dificultad
        });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Ejercicio no encontrado" });
        }

        res.status(200).json({ message: "Ejercicio modificado correctamente" });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};