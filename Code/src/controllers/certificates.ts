import { Request, Response } from 'express';
import {getFiltersData, getStudentsForGeneration, processCertificates} from "../services/certificate/certificates";

export const getGeneratePage = async (req: Request, res: Response) => {
    try {
        // Extract filters from the URL query (e.g., ?courseId=101&year=2024)
        const courseId = req.query.courseId && req.query.courseId !== ''
            ? parseInt(req.query.courseId as string, 10)
            : undefined;
        const year = req.query.year && req.query.year !== ''
            ? parseInt(req.query.year as string, 10)
            : undefined;

        const { courses } = await getFiltersData();
        const students = await getStudentsForGeneration(courseId, year);

        res.render('generate-certificates', {
            students,
            courses,
            filters: { courseId, year },
            successMessage: null,
            errorMessage: null
        });
    } catch (error) {
        res.status(500).send("Error loading generation page.");
    }
};

export const handleGenerateSubmit = async (req: Request, res: Response) => {
    try {
        // Express parses checkboxes into an array if multiple are selected
        let { studentIds } = req.body;

        // Ensure it's an array of numbers
        if (!Array.isArray(studentIds)) {
            studentIds = [studentIds];
        }
        const idsToProcess = studentIds.map((id: string) => parseInt(id));

        const processedStudents = await processCertificates(idsToProcess);

        // Re-render the page with a success message
        const { courses } = await getFiltersData();
        const students = await getStudentsForGeneration(); // Reset list

        res.render('generate-certificates', {
            students,
            courses,
            filters: {},
            successMessage: `Successfully generated ${processedStudents.length} certificates!`,
            errorMessage: null
        });
    } catch (error: any) {
        console.error(error);
        // TODO re-render the page with the error message
        res.redirect('/certificates/generate');
    }
};
