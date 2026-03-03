import express from "express";
import { ReservationModel } from "../models/reservation.model.js";

export const getReservations = async (req: express.Request, res: express.Response) => {
    try {
        const { cliente_id, estado, fecha } = req.query;
        const reservations = await ReservationModel.getAll({
            cliente_id: cliente_id ? parseInt(cliente_id as string) : undefined,
            estado: estado as string,
            fecha: fecha as string
        });
        res.json(reservations);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener reservas", error: error.message });
    }
};

export const getReservationById = async (req: express.Request, res: express.Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const reservation = await ReservationModel.getById(id);
        
        if (reservation.length === 0) {
            return res.status(404).json({ message: "Reserva no encontrada" });
        }
        
        res.json(reservation[0]);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener reserva", error: error.message });
    }
};

export const createReservation = async (req: express.Request, res: express.Response) => {
    try {
        const { turno_id } = req.body;
        const clienteId = (req as any).user?.id;

        if (!clienteId) {
            return res.status(401).json({ message: "No autenticado" });
        }

        if (!turno_id) {
            return res.status(400).json({ message: "Falta turno_id" });
        }

        const id = await ReservationModel.create(clienteId, parseInt(turno_id));
        res.status(201).json({ id, message: "Reserva creada exitosamente" });
    } catch (error: any) {
        console.error(error);
        
        if (error.message.includes('Cupo') || error.message.includes('Límite') || error.message.includes('Ya tienes')) {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Error al crear reserva", error: error.message });
    }
};

export const confirmReservation = async (req: express.Request, res: express.Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const clienteId = (req as any).user?.id;

        if (!clienteId) {
            return res.status(401).json({ message: "No autenticado" });
        }

        const result = await ReservationModel.confirm(id, clienteId);
        res.json(result);
    } catch (error: any) {
        console.error(error);
        
        if (error.message.includes('vencido') || error.message.includes('cancelada') || error.message.includes('ya confirmada')) {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Error al confirmar asistencia", error: error.message });
    }
};

export const cancelReservation = async (req: express.Request, res: express.Response) => {
    try {
        const id = parseInt(req.params.id as string);
        const { motivo } = req.body;
        const clienteId = (req as any).user?.id;

        if (!clienteId) {
            return res.status(401).json({ message: "No autenticado" });
        }

        const result = await ReservationModel.cancel(id, clienteId, motivo);
        res.json(result);
    } catch (error: any) {
        console.error(error);
        
        if (error.message.includes('cancelada') || error.message.includes('no encontrada')) {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: "Error al cancelar reserva", error: error.message });
    }
};
