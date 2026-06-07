
import { generatePdfCertificates } from './generator';
import {ICourseDAO} from "../../dao/interfaces/ICourseDAO";
import {IStudentDAO} from "../../dao/interfaces/IStudentDAO";
import {VariableStudentDAO} from "../../dao/implementations/variableUnsafe/variableStudentDAO";
import {VariableCourseDAO} from "../../dao/implementations/variableUnsafe/variableCourseDAO";


const studentDao: IStudentDAO = new VariableStudentDAO();
const courseDao: ICourseDAO = new VariableCourseDAO();


export async function getFiltersData() {
    const courses = await courseDao.getAllCourses();
    return { courses };
}

export async function getStudentsForGeneration(courseId?: number, year?: number) {
    return await studentDao.getEligibleStudents({ courseId, year });
}

export async function processCertificates(studentIds: number[]) {
    if (!studentIds || studentIds.length === 0) {
        throw new Error("No students selected for generation.");
    }

    // 1. Fetch the full Student objects from the database using their IDs
    const students = await studentDao.getStudentsByIds(studentIds);

    // 2. Pass the validated objects into PDF generator
    await generatePdfCertificates(students);

    return students;

}