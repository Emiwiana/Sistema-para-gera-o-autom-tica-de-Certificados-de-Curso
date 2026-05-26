import {Student} from "../../model/student";

interface studentDAO {
    getStudentByID(id: number) : Student
    getStudentByName(name: string) : Student
    getStudentByEmail(email: string) : Student
}