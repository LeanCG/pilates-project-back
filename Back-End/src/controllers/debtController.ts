import { Request, Response } from 'express';
import { DeudaModel } from '../models/deuda.model.js';
import { authenticate, authorize } from '../middlewares/auth.js';

export class DebtController {
    static async getMyDebts(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const debts = await DeudaModel.getByClient(userId);
            res.json(debts);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getMyDebtSummary(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const summary = await DeudaModel.getSummary(userId);
            res.json(summary);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getAllDebts(req: Request, res: Response) {
        try {
            const { estado, cliente_id } = req.query;
            const filters: any = {};
            
            if (estado) filters.estado = estado as string;
            if (cliente_id) filters.cliente_id = parseInt(cliente_id as string);
            
            const debts = await DeudaModel.getAll(filters);
            res.json(debts);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getPendingDebts(req: Request, res: Response) {
        try {
            const debts = await DeudaModel.getPending();
            res.json(debts);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async createDebt(req: Request, res: Response) {
        try {
            const { cliente_id, monto, monto_original, intereses, fecha_vencimiento } = req.body;
            
            if (!cliente_id || !monto || !monto_original || !fecha_vencimiento) {
                return res.status(400).json({ message: 'Faltan datos requeridos' });
            }
            
            const id = await DeudaModel.create(cliente_id, { monto, monto_original, intereses, fecha_vencimiento });
            res.status(201).json({ message: 'Deuda creada', id });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async payDebt(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await DeudaModel.pay(parseInt(id as string));
            res.json({ message: 'Deuda pagada correctamente' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async cancelDebt(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await DeudaModel.cancel(parseInt(id as string));
            res.json({ message: 'Deuda cancelada' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
