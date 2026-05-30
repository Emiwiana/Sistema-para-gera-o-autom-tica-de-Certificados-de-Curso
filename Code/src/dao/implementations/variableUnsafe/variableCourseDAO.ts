import {ICourseDAO} from "../../interfaces/ICourseDAO";
import {Course} from "../../../model/course";

export const sampleCourse = new Course(101, 'Curso de Teste', '2025-01-01', '2025-06-30');

export class VariableCourseDAO implements ICourseDAO {
    getAllCourses(): Promise<Course[]> {
        return Promise.resolve([sampleCourse]);
    }

    getCourseById(id: number): Course | null{
        //TODO
        return null;
    }

    getCourseByName(name: string): Course | null{
        //TODO
        return null;
    }

}