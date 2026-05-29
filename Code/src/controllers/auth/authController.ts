import { Request, Response } from 'express';

const demoCredentials = {
    email: process.env.LOGIN_DEMO_EMAIL || 'admin@example.com',
    password: process.env.LOGIN_DEMO_PASSWORD || 'admin123',
    role: process.env.LOGIN_DEMO_ROLE || 'ADMIN',
};

export function showLogin(req: Request, res: Response) {
    res.render('login', {
        errorMessage: null,
        successMessage: null,
    });
}

export function login(req: Request, res: Response) {
    const email = String(req.body?.email || '').trim();
    const password = String(req.body?.password || '');

    if (email === demoCredentials.email && password === demoCredentials.password) {
        res.cookie('demo_auth_user', email, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000,
        });

        res.cookie('demo_auth_role', demoCredentials.role, {
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



