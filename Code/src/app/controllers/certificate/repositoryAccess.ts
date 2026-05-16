import {Student} from "../../models/student";
import {outputPathPDF} from "./certificateGenerator";
import fs from "fs";


const pdfLocation = outputPathPDF

export function getCertificateByStudent(student : Student) {
    const id = student.id;
    try {
        return fs.createReadStream(outputPathPDF + `/certificado_${id}.pdf`, "utf8")
    } catch (error) {
        return null;
    }
}