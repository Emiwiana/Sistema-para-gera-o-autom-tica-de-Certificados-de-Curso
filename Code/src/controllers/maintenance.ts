import { Request, Response } from 'express';
import {
    getSortedCertificates,
    sortCertificatesByStudentNumber,
    deleteCertificates, getCertificateBeforeDate, getCertificateBeforeStudentNumber, getCertificatesByCourse
} from "../services/maintenance/maintenance";
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

export const scheduleDeletion = async (req: Request, res: Response) => {
    const { fileName, scheduledDate } = req.body;

    // TODO: Pensei que seria engraçado acrescentar, por agora fica opcional
    //se tivermos tempo, fazemos isto
    console.log(`Scheduled ${fileName} for deletion on ${scheduledDate}`);
    // For now, just redirect back
    res.redirect('/admin/maintenance');
};

const createDeletionController = (
    paramName: string,
    getCertificatesFn: (param: any) => Promise<any>) => {
    return async (req: Request, res: Response) => {
        const paramValue = req.body[paramName];

        if (!paramValue) {
            return res.status(400).send(`${paramName} is required`);
        }

        const certificates = await getCertificatesFn(paramValue);
        const success = await deleteCertificates(certificates);
        if (success) {
            res.redirect('/admin/maintenance');
        } else {
            res.status(500).send("Failed to delete file(s)");
        }
    };
};

export const deleteNow = createDeletionController(
    'fileName',
    // We instantly return the single file in an array to satisfy the factory's flow
    async (fileName: string) => [{ fileName }]
);

export const deleteBeforeDate = createDeletionController(
    'deleteBeforeDate',
    getCertificateBeforeDate
);

export const deleteBeforeStudentNumber = createDeletionController(
    'studentNumber',
    getCertificateBeforeStudentNumber
);

export const deleteByCourse = createDeletionController(
    'courseId',
    getCertificatesByCourse
);
