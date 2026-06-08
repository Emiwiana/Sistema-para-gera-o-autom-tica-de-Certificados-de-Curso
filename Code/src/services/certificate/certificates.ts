
import { generatePdfCertificates } from './generator';
import {ICourseDAO} from "../../dao/interfaces/ICourseDAO";
import {IStudentDAO} from "../../dao/interfaces/IStudentDAO";
import {VariableStudentDAO} from "../../dao/implementations/variableUnsafe/variableStudentDAO";
import {VariableCourseDAO} from "../../dao/implementations/variableUnsafe/variableCourseDAO";
import {TemplateDAO} from "../../dao/implementations/local/templateDAO";

const studentDao: IStudentDAO = new VariableStudentDAO();
const courseDao: ICourseDAO = new VariableCourseDAO();
const templateDao = new TemplateDAO();

export async function getFiltersData() {
    const courses = await courseDao.getAllCourses();
    return { courses };
}

export async function getStudentsForGeneration(courseId?: number, year?: number) {
    return await studentDao.getEligibleStudents({ courseId, year });
}

export async function processCertificates(studentIds: number[], templateId: number) {
    if (!studentIds || studentIds.length === 0) {
        throw new Error("No students selected for generation.");
    }

    // 1. Fetch the template
    const template = await templateDao.getTemplateById(templateId);
    if (!template) {
        throw new Error(`Template not found with ID ${templateId}`);
    }

    // 2. Fetch the full Student objects from the database using their IDs
    const students = await studentDao.getStudentsByIds(studentIds);

    // 3. Pass the validated objects and layout into PDF generator
    await generatePdfCertificates(students, template.layout);

    return students;
}