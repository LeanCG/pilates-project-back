import express from "express";
import { RoutineModel } from "../models/routine.model.js";

export const getRoutines = async (req: express.Request, res: express.Response) => {
    try {
        const routines: any = await RoutineModel.getRoutines();

        if (routines.length === 0) {
            return res.status(404).json({ error: "No se encontraron rutinas" });
        }

        res.status(200).json(routines);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const createRoutine = async (req: express.Request, res: express.Response) => {
    const { descripcion, ejercicios } = req.body;

    if (!ejercicios || ejercicios.length === 0) {
        return res.status(400).json({ error: "Se requiere al menos un ejercicio" });
    }

    try {
        await RoutineModel.createRoutine(descripcion, ejercicios);
        res.status(201).json({ message: 'Rutina creada con éxito' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
}

export const deleteRoutine = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "El ID de la rutina es requerido" });
    }

    try {
        await RoutineModel.deleteRoutine(Number(id));
        res.status(200).json({ message: "La Rutina ha sido eliminada correctamente" });
    } catch (err: any) {
        if (err.message === "Rutina no encontrada") {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: err.message });
    }
}

export const updateRoutine = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { descripcion, ejercicios } = req.body;

    if (!id) {
        return res.status(400).json({ error: "El ID de la rutina es requerido" });
    }

    try {
        await RoutineModel.updateRoutine(Number(id), descripcion, ejercicios);
        res.status(200).json({ message: 'Rutina y ejercicios actualizados con éxito' });
    } catch (err: any) {
        if (err.message.includes("no encontrad")) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ message: err.message });
    }
};

export const getRoutineId = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const results: any = await RoutineModel.getRoutineById(Number(id));

        if (results.length === 0) {
            return res.status(404).json({ error: "No se encontraron rutinas" });
        }

        res.status(200).json(results);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};