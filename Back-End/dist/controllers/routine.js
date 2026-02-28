import { RoutineModel } from "../models/routine.model.js";
/**
 * Retrieves all routines from the database.
 * @param req - Express request object.
 * @param res - Express response object.
 */
export const getRoutines = async (req, res) => {
    try {
        const routines = await RoutineModel.getRoutines();
        if (routines.length === 0) {
            return res.status(404).json({ error: "No se encontraron rutinas" });
        }
        res.status(200).json(routines);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
/**
 * Creates a new routine with its associated exercises.
 * @param req - Express request object with routine description and exercises array in body.
 * @param res - Express response object.
 */
export const createRoutine = async (req, res) => {
    const { descripcion, ejercicios } = req.body;
    if (!ejercicios || ejercicios.length === 0) {
        return res.status(400).json({ error: "Se requiere al menos un ejercicio" });
    }
    try {
        await RoutineModel.createRoutine(descripcion, ejercicios);
        res.status(201).json({ message: 'Rutina creada con éxito' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
/**
 * Deletes a routine by its ID.
 * @param req - Express request object with routine ID in params.
 * @param res - Express response object.
 */
export const deleteRoutine = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "El ID de la rutina es requerido" });
    }
    try {
        await RoutineModel.deleteRoutine(Number(id));
        res.status(200).json({ message: "La Rutina ha sido eliminada correctamente" });
    }
    catch (err) {
        if (err.message === "Rutina no encontrada") {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: err.message });
    }
};
/**
 * Updates an existing routine and its associated exercises.
 * @param req - Express request object with routine ID in params and updated data in body.
 * @param res - Express response object.
 */
export const updateRoutine = async (req, res) => {
    const { id } = req.params;
    const { descripcion, ejercicios } = req.body;
    if (!id) {
        return res.status(400).json({ error: "El ID de la rutina es requerido" });
    }
    try {
        await RoutineModel.updateRoutine(Number(id), descripcion, ejercicios);
        res.status(200).json({ message: 'Rutina y ejercicios actualizados con éxito' });
    }
    catch (err) {
        if (err.message.includes("no encontrad")) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ message: err.message });
    }
};
/**
 * Retrieves a specific routine and its exercises by ID.
 * @param req - Express request object with routine ID in params.
 * @param res - Express response object.
 */
export const getRoutineId = async (req, res) => {
    try {
        const { id } = req.params;
        const results = await RoutineModel.getRoutineById(Number(id));
        if (results.length === 0) {
            return res.status(404).json({ error: "No se encontraron rutinas" });
        }
        res.status(200).json(results);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
