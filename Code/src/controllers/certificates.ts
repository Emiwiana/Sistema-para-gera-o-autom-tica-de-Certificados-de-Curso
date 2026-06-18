import { Request, Response } from 'express';
import {getFiltersData, getStudentsForGeneration, processCertificates} from "../services/certificate/certificates";
import {TemplateDAO} from "../dao/implementations/local/templateDAO";

const templateDAO = new TemplateDAO();

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
        const allTemplates = await templateDAO.getAllTemplates();

        // When a course is selected, show only templates for that course.
        // When no filter is active, show all templates.
        const templates = courseId != null
            ? allTemplates.filter(t => t.courseId === courseId)
            : allTemplates;

        res.render('generate-certificates', {
            students,
            courses,
            templates,
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
        let { studentIds, templateId } = req.body;

        const templates = await templateDAO.getAllTemplates();
        const { courses } = await getFiltersData();
        const students = await getStudentsForGeneration();

        if (!templateId) {
            return res.render('generate-certificates', {
                students,
                courses,
                templates,
                filters: {},
                successMessage: null,
                errorMessage: "Please select a template to generate the certificates."
            });
        }

        const numericTemplateId = parseInt(templateId, 10);
        if (isNaN(numericTemplateId)) {
            return res.render('generate-certificates', {
                students,
                courses,
                templates,
                filters: {},
                successMessage: null,
                errorMessage: "Invalid template selected."
            });
        }

        if (!studentIds || (Array.isArray(studentIds) && studentIds.length === 0)) {
            return res.render('generate-certificates', {
                students,
                courses,
                templates,
                filters: {},
                successMessage: null,
                errorMessage: "No students selected for generation."
            });
        }

        // Ensure it's an array of numbers
        if (!Array.isArray(studentIds)) {
            studentIds = [studentIds];
        }
        const idsToProcess = studentIds.map((id: string) => parseInt(id));

        const processedStudents = await processCertificates(idsToProcess, numericTemplateId);

        // Re-render the page with a success message
        res.render('generate-certificates', {
            students,
            courses,
            templates,
            filters: {},
            successMessage: `Successfully generated ${processedStudents.length} certificates!`,
            errorMessage: null
        });
    } catch (error: any) {
        console.error(error);
        res.redirect('/certificates/generate');
    }
};
