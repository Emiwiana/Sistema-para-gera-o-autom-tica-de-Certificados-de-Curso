import {Request, Response} from "express";

export const showDashboard = (req: Request, res: Response) => {
    res.render('index');
};