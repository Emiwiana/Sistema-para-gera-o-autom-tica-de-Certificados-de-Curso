import { Request, Response } from 'express';
import {CertificateDAO} from "../dao/implementations/local/certificateDAO";


const dao = new CertificateDAO();

export const getMaintenancePage = async (req: Request, res: Response) => {
    const sortOrder = req.query.sort === 'oldest' ? 'oldest' : 'newest';

    let files = await dao.getAllCertificates();

    // Sort the files by age
    files.sort((a, b) => {
        if (sortOrder === 'oldest') {
            return a.timestamp - b.timestamp; // Ascending
        } else {
            return b.timestamp - a.timestamp; // Descending
        }
    });

    res.render('maintenance', { files, sortOrder });
};

export const deleteCertificate = async (req: Request, res: Response) => {
    const { fileName } = req.body;

    if (!fileName) {
        return res.status(400).send("Filename is required");
    }

    const success = await dao.deleteCertificate(fileName);

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