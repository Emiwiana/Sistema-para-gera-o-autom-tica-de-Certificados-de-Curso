import { Request, Response } from 'express';
import {getSortedCertificates, sortCertificatesByStudentNumber, deleteCertificate, getCertificateBeforeDate, getCertificateBeforeStudentNumber} from "../services/maintenance/maintenance";


export const getMaintenancePage = async (req: Request, res: Response) => {
    const sortParam = String(req.query.sort || 'newest');
    let files;
    let sortOrder;

    console.log('maintenance sortParam:', sortParam);

    if (sortParam === 'oldest' || sortParam === 'newest') {
        sortOrder = sortParam;
        files = await getSortedCertificates(sortOrder);
    } else if (sortParam === 'increasing' || sortParam === 'decreasing') {
        sortOrder = sortParam;
        files = await sortCertificatesByStudentNumber(sortOrder);
    } else {
        sortOrder = 'newest';
        files = await getSortedCertificates(sortOrder);
    }

    console.log('maintenance files first:', files.slice(0, 5).map(f => f.fileName));
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

export const deleteBeforeDate = async (req: Request, res: Response) => {
    const { deleteBeforeDate } = req.body;
    const files = await getCertificateBeforeDate(deleteBeforeDate);
    for (const file of files) {
        await deleteCertificate(file.fileName);
    }
    console.log(`Deleted files before ${deleteBeforeDate}:`, files.map(f => f.fileName));
    res.redirect('/admin/maintenance');
};

export const deleteCertificateBeforeStudentNumber = async (req: Request, res: Response) => {
    const { studentNumber } = req.body;
    const files = await getCertificateBeforeStudentNumber(studentNumber);
    for (const file of files) {
        await deleteCertificate(file.fileName);
    }
    console.log(`Deleted files before student number ${studentNumber}:`, files.map(f => f.fileName));
    res.redirect('/admin/maintenance');
};
