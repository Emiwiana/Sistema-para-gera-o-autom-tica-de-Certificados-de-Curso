import path from "path";
import {Student} from "../../../model/student";
import {getCertificateFileName, outputPathPDF} from "../../../services/certificate/generator";
import fs from "fs";

export function getCertificateByStudent(student : Student) {
    try {
        const filePath = path.join(outputPathPDF, getCertificateFileName(student));

        if (!fs.existsSync(filePath)) {
            return null;
        }

        return fs.readFileSync(filePath);
    } catch (error) {
        return null;
    }
}