import { Request, Response, NextFunction } from 'express';
import {getEnforcer} from "../configs/casbin/casbin";

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Get the user's role. 
        // This assumes your authentication middleware sets req.user before this runs.
        // If you store the role in a session or JWT, extract it here.
        const userRole = (req as any).user?.role;

        if (!userRole) {
            return res.status(401).json({ error: 'Unauthorized: User role not found.' });
        }

        // 2. Get the requested path and method
        const path = req.path;
        const method = req.method;

        // 3. Ask Casbin if this role can access this path with this method
        const enforcer = await getEnforcer();
        const isAllowed = await enforcer.enforce(userRole, path, method);

        if (isAllowed) {
            // Permission granted, move to the route handler
            next();
        } else {
            // Permission denied
            res.status(403).json({ error: 'Forbidden: You do not have permission to perform this action.' });
        }
    } catch (error) {
        console.error('Authorization error:', error);
        res.status(500).json({ error: 'Internal Server Error during authorization.' });
    }
};