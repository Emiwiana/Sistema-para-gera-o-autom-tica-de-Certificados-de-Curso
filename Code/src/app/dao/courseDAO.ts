//TODO: Código para criar um objecto do tipo 'course' a partir da BD

import {Course} from "../models/course";

interface CourseDAO {
    getCourseById(id: number): Course;
    getCourseByName(name: string): Course;
}