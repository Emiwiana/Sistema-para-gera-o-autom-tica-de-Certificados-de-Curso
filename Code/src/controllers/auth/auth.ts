import { Request, Response } from 'express';
import {validateCredentials} from "../../services/auth/auth";

export function showLogin(req: Request, res: Response) {
    res.render('login', {
        errorMessage: null,
        successMessage: null,
    });
}

export async function login(req: Request, res: Response) {
    const email = String(req.body?.email || '').trim();
    const password = String(req.body?.password || '');

    const user = await validateCredentials(email, password);

    if (user != null) {
        res.cookie('demo_auth_user', user.email, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000,
        });

        res.cookie('demo_auth_role', user.role, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000,
        });

        return res.redirect('/');
    }

    return res.render('login', {
        errorMessage: 'Credenciais inválidas. Tenta admin@example.com / admin123.',
        successMessage: null,
    });
}

export function logout(req: Request, res: Response) {
    res.clearCookie('demo_auth_user');
    res.clearCookie('demo_auth_role');
    return res.redirect('/auth/login');
}



