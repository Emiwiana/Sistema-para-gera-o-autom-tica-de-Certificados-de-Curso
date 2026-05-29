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
    res.type('html').send(`
        <!DOCTYPE html>
        <html lang="pt">
        <head>
            <meta charset="UTF-8">
            <title>Certificate Generator Test Page</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 2rem; line-height: 1.5; }
                .card { max-width: 760px; padding: 1.5rem; border: 1px solid #ccc; border-radius: 10px; }
                a { display: inline-block; margin-right: 0.75rem; margin-top: 0.5rem; text-decoration: none; }
                button { padding: 0.6rem 1rem; font-size: 1rem; cursor: pointer; }
            </style>
        </head>
        <body>
            <div class="card">
                <h1>Certificate Generator</h1>
                <p>The app is running locally.</p>
                <p>Use these links to test the available entry points:</p>
                <ul>
                    <li><a href="/auth/login">/auth/login</a> — login route</li>
                    <li><a href="/health">/health</a> — simple health check</li>
                    <li><a href="/test-pdf">/test-pdf</a> — generate 5 sample PDFs</li>
                </ul>
                <p><a href="/test-pdf"><button type="button">Generate 5 sample PDFs</button></a></p>
                <p>If you want, this page can later be replaced with a real dashboard.</p>
            </div>
        </body>
        </html>
    `);
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

        res.type('html').send(`
            <!DOCTYPE html>
            <html lang="pt">
            <head>
                <meta charset="UTF-8">
                <title>PDF Generation Test</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 2rem; line-height: 1.5; }
                    .card { max-width: 760px; padding: 1.5rem; border: 1px solid #ccc; border-radius: 10px; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>PDF Generation Test</h1>
                    <p>5 sample PDFs were generated in one batch.</p>
                    <ul>
                        ${generatedFiles.map((generatedFile) => `
                            <li>
                                ${generatedFile.fileName} —
                                ${generatedFile.exists ? `<a href="${generatedFile.url}">Open PDF</a>` : 'not generated'}
                            </li>
                        `).join('')}
                    </ul>
                    <p><a href="/">Back to homepage</a></p>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate sample PDF' });
    }
});

module.exports = router;
