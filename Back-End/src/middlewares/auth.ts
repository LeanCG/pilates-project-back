import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: {
        id: number;
        rol_id: number;
        username: string;
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const secret = process.env.JWT_SECRET || 'your_dev_secret';
        const decoded = jwt.verify(token, secret) as {
            id: number;
            rol_id: number;
            username: string;
        };
        
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

const ROLE_MAP: Record<string, number> = {
    admin: 1,
    cliente: 2,
    comun: 2,
    instructor: 3,
};

export const authorize = (...allowedRoles: Array<number | string>) => {
    const normalizedRoles = allowedRoles
        .map((role) => {
            if (typeof role === 'number') return role;
            return ROLE_MAP[role.toLowerCase()];
        })
        .filter((role): role is number => typeof role === 'number');

    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado' });
        }

        if (!normalizedRoles.includes(req.user.rol_id)) {
            return res.status(403).json({ message: 'No autorizado' });
        }

        next();
    };
};
