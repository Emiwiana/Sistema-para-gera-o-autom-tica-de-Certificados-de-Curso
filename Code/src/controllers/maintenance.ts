import { Request, Response } from 'express';
import {getSortedCertificates, deleteCertificate} from "../services/maintenance/maintenance";

export const getMaintenancePage = async (req: Request, res: Response) => {
    const sortOrder = req.query.sort === 'oldest' ? 'oldest' : 'newest';
    const files = getSortedCertificates(sortOrder);

    res.render('maintenance', { files, sortOrder });
};

export const deleteNow = async (req: Request, res: Response) => {
    const { fileName } = req.body;

    if (!fileName) {
        return res.status(400).send("Filename is required");
    }

    const success = await deleteCertificate(fileName);

    if (success) {
        // Redirect back to the maintenance page to see the updated list
        res.redirect('/admin/maintenance');
    } else {
        res.status(500).send("Failed to delete file");
    }
};

export const scheduleDeletion = async (req: Request, res: Response) => {
    const { fileName, scheduledDate } = req.body;

    // TODO: Pensei que seria engraçado acrescentar, por agora fica opcional
    //se tivermos tempo, fazemos isto
    console.log(`Scheduled ${fileName} for deletion on ${scheduledDate}`);
    // For now, just redirect back
    res.redirect('/admin/maintenance');
};