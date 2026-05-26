import {Course} from "../../model/course";

interface CourseDAO {
    getCourseById(id: number): Course;
    getCourseByName(name: string): Course;
}