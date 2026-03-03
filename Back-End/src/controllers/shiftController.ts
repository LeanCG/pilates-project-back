import express from "express";
import { ShiftModel } from "../models/shift.model.js";

export const getShifts = async (req: express.Request, res: express.Response) => {
    try {
        const { fecha, instructor_id } = req.query;
        const shifts = await ShiftModel.getAll({
            fecha: fecha as string,
            instructor_id: instructor_id ? parseInt(instructor_id as string) : undefined
        });
        res.json(shifts);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener turnos", error: error.message });
    }
};

export const getShiftById = async (req: express.Request, res: express.Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const shift = await ShiftModel.getById(id);
        
        if (shift.length === 0) {
            return res.status(404).json({ message: "Turno no encontrado" });
        }
        
        res.json(shift[0]);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener turno", error: error.message });
    }
};

export const getAvailableShifts = async (req: express.Request, res: express.Response) => {
    try {
        const { fecha } = req.query;
        const shifts = await ShiftModel.getAvailable(fecha as string);
        res.json(shifts);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener turnos disponibles", error: error.message });
    }
};

export const createShift = async (req: express.Request, res: express.Response) => {
    try {
        const { fecha, hora, instructor_id, actividad, tipo_pilates_id, capacidad } = req.body;

        if (!fecha || !hora || !instructor_id || !actividad) {
            return res.status(400).json({ message: "Faltan campos obligatorios" });
        }

        const id = await ShiftModel.create({
            fecha,
            hora,
            instructor_id: parseInt(instructor_id),
            actividad,
            tipo_pilates_id: tipo_pilates_id ? parseInt(tipo_pilates_id) : undefined,
            capacidad: capacidad || 10
        });

        res.status(201).json({ id, message: "Turno creado exitosamente" });
    } catch (error: any) {
        console.error(error);
        
        if (error.message.includes('pasado') || error.message.includes('conflicto')) {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Error al crear turno", error: error.message });
    }
};

export const updateShift = async (req: express.Request, res: express.Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const result = await ShiftModel.update(id, req.body);
        res.json(result);
    } catch (error: any) {
        console.error(error);
        
        if (error.message.includes('pasado')) {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Error al actualizar turno", error: error.message });
    }
};

export const deleteShift = async (req: express.Request, res: express.Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const result = await ShiftModel.delete(id);
        res.json(result);
    } catch (error: any) {
        console.error(error);
        
        if (error.message.includes('reservas')) {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Error al eliminar turno", error: error.message });
    }
};
