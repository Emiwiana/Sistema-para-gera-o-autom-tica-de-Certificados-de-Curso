import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Course } from '../model/course';
import { Student } from '../model/student';
import { generatePdfCertificates, getCertificateFileName, outputPathPDF } from '../services/certificate/generator';

// Move the mock data here for now
const sampleCourse = new Course(101, 'Curso de Teste', '2025-01-01', '2025-06-30');
const sampleStudents = Array.from({ length: 5 }, (_, index) =>
    new Student(9001 + index, `Aluno de Teste ${index + 1}`, `teste${index + 1}@example.com`, sampleCourse)
);

export const generateTestPdfs = async (req: Request, res: Response) => {
    try {
        await generatePdfCertificates(sampleStudents);

        const generatedFiles = sampleStudents.map((student) => {
            const fileName = getCertificateFileName(student);
            return {
                fileName,
                url: `/generated/${fileName}`,
                exists: fs.existsSync(path.join(outputPathPDF, fileName)),
            };
        });

        res.render('generate-certificates', { generatedFiles });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate sample PDF' });
    }
};

