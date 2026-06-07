import { Request, Response } from 'express';
import {
    deleteCertificates,
    getCertificatesBeforeDate,
    getCertificatesBeforeStudentNumber,
    getCertificatesByCourse,
    getCertificateByName, getMaintenanceData
} from "../services/maintenance/maintenance";
import { getFiltersData } from '../services/certificate/certificates';
import {Certificate} from "../model/certificate";


export const getMaintenancePage = async (req: Request, res: Response) => {
    const sortParam = String(req.query.sort || 'newest');
    const courseIdQuery = req.query.courseId as string | undefined;
    const courseId = courseIdQuery ? parseInt(courseIdQuery, 10) : undefined;

    // Delegate business rules entirely to the service layer
    const { files, sortOrder } = await getMaintenanceData(sortParam, courseId);
    const { courses } = await getFiltersData();

    res.render('maintenance', {
        files,
        sortOrder,
        courses,
        selectedCourseId: courseIdQuery
    });
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
    getCertificatesFn: (param: string) => Promise<Certificate[]>) => {
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
    getCertificateByName
);

export const deleteBeforeDate = createDeletionController(
    'deleteBeforeDate',
    getCertificatesBeforeDate
);

export const deleteBeforeStudentNumber = createDeletionController(
    'studentNumber',
    getCertificatesBeforeStudentNumber
);

export const deleteByCourse = createDeletionController(
    'courseId',
    getCertificatesByCourse
);
