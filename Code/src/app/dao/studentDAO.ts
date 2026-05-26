//TODO: Código para criar um objecto do tipo 'student' a partir da BD

import {Student} from "../models/student";

interface studentDAO {
    getStudentByID(id: number) : Student
    getStudentByName(name: string) : Student
    getStudentByEmail(email: string) : Student
}