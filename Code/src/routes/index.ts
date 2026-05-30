import express from 'express';
import fs from 'fs';
import path from 'path';
import { router as authRoutes } from './auth';
import { Course } from '../model/course';
import { Student } from '../model/student';
import { generatePdfCertificates, getCertificateFileName, outputPathPDF } from '../services/certificate/generator';

export const router = express.Router();

router.use('/auth', authRoutes);

const sampleCourse = new Course(101, 'Curso de Teste', '2025-01-01', '2025-06-30');
const sampleStudents = Array.from({ length: 5 }, (_, index) =>
    new Student(9001 + index, `Aluno de Teste ${index + 1}`, `teste${index + 1}@example.com`, sampleCourse)
);

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/health', (req, res) => {
    res.json({ status: 'ok', app: 'certificate-generator' });
});

router.get('/test-pdf', async (req, res) => {
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

        res.render('generate-certificates', {generatedFiles});
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate sample PDF' });
    }
});

module.exports = router;
