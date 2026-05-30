import express, {NextFunction} from 'express';
import fs from 'fs';
import path from 'path';
import {router as authRoutes} from './auth';
import {Course} from '../model/course';
import {Student} from '../model/student';
import {generatePdfCertificates, getCertificateFileName, outputPathPDF} from '../services/certificate/generator';
import {authorize} from "../middlewares/casbinEnforce";

const sampleCourse = new Course(101, 'Curso de Teste', '2025-01-01', '2025-06-30');
const sampleStudents = Array.from({ length: 5 }, (_, index) =>
    new Student(9001 + index, `Aluno de Teste ${index + 1}`, `teste${index + 1}@example.com`, sampleCourse)
);

export const router = express.Router();



const requireAuth = (req: any, res: any, next: any) => {
    const userEmail = req.cookies?.demo_auth_user;

    if (!userEmail) {
        return res.redirect('/auth/login');
    }

    req.user = {
        email: userEmail,
        role: req.cookies?.demo_auth_role
    };

    next();
};

router.use('/auth', authRoutes);

router.get('/', requireAuth, (req, res) => {
    res.render('index');
});

router.get('/test-pdf', requireAuth, authorize, async (req, res) => {
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
