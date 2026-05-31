import {IStudentDAO} from "../../interfaces/IStudentDAO";
import {Student} from "../../../model/student";
import {sampleCourse} from "./variableCourseDAO";

//TODO: Incluir a data de inicio e conclusão de curso (temos de ver melhor como isso estaria numa BD)
const sampleStudents = Array.from({ length: 15 }, (_, index) =>
    new Student(9001 + index, `Aluno de Teste ${index + 1}`, `teste${index + 1}@example.com`, sampleCourse)
);


export class VariableStudentDAO implements IStudentDAO {
    getEligibleStudents(filters: { courseId?: number; year?: number }): Promise<Student[]> {
        //TODO: filtrar por data
        return Promise.resolve(sampleStudents.filter(student => {
            return !(filters.courseId && student.course.id != filters.courseId);

        }));
    }

    getStudentByEmail(email: string): Student | null {
        const student = sampleStudents.find(s => s.email == email);
        if (!student) throw new Error(`Student with email ${email} not found.`);
        return student;
    }

    getStudentByID(id: number): Student | null {
        const student = sampleStudents.find(s => s.id == id);
        if (!student) throw new Error(`Student with ID ${id} not found.`);
        return student;
    }

    getStudentByName(name: string): Student | null {
        const student = sampleStudents.find(s => s.name == name);
        if (!student) throw new Error(`Student with name ${name} not found.`);
        return student;
    }

    getStudentsByIds(studentIds: number[]): Promise<Student[]> {
        return Promise.resolve(sampleStudents.filter(student => studentIds.includes(student.id)));
    }
}