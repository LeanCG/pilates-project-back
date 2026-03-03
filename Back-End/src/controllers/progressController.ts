import { Request, Response } from 'express';
import { ProgressModel } from '../models/progress.model.js';
import { authenticate, authorize } from '../middlewares/auth.js';

export class ProgressController {
    static async getMyProgress(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const progress = await ProgressModel.getByClient(userId);
            res.json(progress);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getProgressByClient(req: Request, res: Response) {
        try {
            const { clienteId } = req.params;
            const progress = await ProgressModel.getByClient(parseInt(clienteId as string));
            res.json(progress);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getAllProgress(req: Request, res: Response) {
        try {
            const { cliente_id, fecha_inicio, fecha_fin } = req.query;
            const filters: any = {};
            
            if (cliente_id) filters.cliente_id = parseInt(cliente_id as string);
            if (fecha_inicio) filters.fecha_inicio = fecha_inicio as string;
            if (fecha_fin) filters.fecha_fin = fecha_fin as string;
            
            const progress = await ProgressModel.getAll(filters);
            res.json(progress);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async createProgress(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { fecha, peso, observaciones } = req.body;
            
            if (!fecha) {
                return res.status(400).json({ message: 'La fecha es requerida' });
            }
            
            const id = await ProgressModel.create(userId, { fecha, peso, observaciones });
            res.status(201).json({ message: 'Progreso registrado', id });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateProgress(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { fecha, peso, observaciones } = req.body;
            
            await ProgressModel.update(parseInt(id as string), { fecha, peso, observaciones });
            res.json({ message: 'Progreso actualizado' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteProgress(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await ProgressModel.delete(parseInt(id as string));
            res.json({ message: 'Progreso eliminado' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getLatestProgress(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const progress = await ProgressModel.getLatest(userId);
            res.json(progress);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getHistoryProgress(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const limit = parseInt(req.query.limit as string) || 10;
            const progress = await ProgressModel.getHistory(userId, limit);
            res.json(progress);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
