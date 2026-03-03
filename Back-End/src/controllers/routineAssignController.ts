import { Request, Response } from 'express';
import { RoutineAssignModel } from '../models/routine_assign.model.js';
import { authenticate, authorize } from '../middlewares/auth.js';

export class RoutineAssignController {
    static async assignRoutine(req: Request, res: Response) {
        try {
            const instructorId = (req as any).user.id;
            const { cliente_id, rutina_id, observaciones } = req.body;
            
            if (!cliente_id || !rutina_id) {
                return res.status(400).json({ message: 'cliente_id y rutina_id son requeridos' });
            }
            
            const id = await RoutineAssignModel.assignToClient(
                cliente_id, 
                rutina_id, 
                instructorId, 
                observaciones
            );
            
            res.status(201).json({ message: 'Rutina asignada correctamente', id });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getMyRoutines(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const routines = await RoutineAssignModel.getByClient(userId);
            res.json(routines);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getMyActiveRoutine(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const routine = await RoutineAssignModel.getActiveByClient(userId);
            res.json(routine);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getAllAssignments(req: Request, res: Response) {
        try {
            const { cliente_id, instructor_id, activa } = req.query;
            const filters: any = {};
            
            if (cliente_id) filters.cliente_id = parseInt(cliente_id as string);
            if (instructor_id) filters.instructor_id = parseInt(instructor_id as string);
            if (activa !== undefined) filters.activa = activa === 'true';
            
            const assignments = await RoutineAssignModel.getAllAssignments(filters);
            res.json(assignments);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deactivateAssignment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await RoutineAssignModel.deactivate(parseInt(id as string));
            res.json({ message: 'Asignación desactivada' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
