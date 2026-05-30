import {Student} from "../../model/student";

export interface IStudentDAO {
    getStudentByID(id: number) : Student | null;
    getStudentByName(name: string) : Student | null;
    getStudentByEmail(email: string) : Student | null;

    getStudentsByIds(studentIds: number[]): Promise<Student[]>;
    // Fetches students who have completed their course, optionally filtered
    getEligibleStudents(filters: { courseId?: number; year?: number }): Promise<Student[]>;
}