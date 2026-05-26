import {Student} from "../../../model/student";
import {outputPathPDF} from "../../../services/certificate/generator";
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