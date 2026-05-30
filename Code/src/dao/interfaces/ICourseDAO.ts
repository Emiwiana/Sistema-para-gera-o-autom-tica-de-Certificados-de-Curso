import {Course} from "../../model/course";

export interface ICourseDAO {
    getCourseById(id: number): Course | null;
    getCourseByName(name: string): Course | null;

    getAllCourses(): Promise<Course[]>;
}