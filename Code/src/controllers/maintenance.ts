import { Request, Response } from 'express';
import {getSortedCertificates, sortCertificatesByStudentNumber, deleteCertificate, getCertificateBeforeDate, getCertificateBeforeStudentNumber, getCertificatesByCourse} from "../services/maintenance/maintenance";
import { getFiltersData } from '../services/certificate/certificates';


export const getMaintenancePage = async (req: Request, res: Response) => {
    const sortParam = String(req.query.sort || 'newest');
    const courseIdQuery = req.query.courseId as string | undefined;
    const courseId = courseIdQuery ? parseInt(courseIdQuery, 10) : undefined;
    let files;
    let sortOrder;

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

    // If course filter is applied, narrow down the files
    if (!Number.isNaN(Number(courseId))) {
        files = files.filter(f => {
            const parts = f.fileName.split('_');
            const cid = parseInt(parts[2], 10);
            return !Number.isNaN(cid) && cid === courseId;
        });
    }

    const { courses } = await getFiltersData();
    res.render('maintenance', { files, sortOrder, courses, selectedCourseId: courseIdQuery });
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

export const deleteCertificatesByCourse = async (req: Request, res: Response) => {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).send('courseId is required');
    const files = await getCertificatesByCourse(courseId);
    for (const file of files) {
        await deleteCertificate(file.fileName);
    }
    res.redirect('/admin/maintenance');
};
