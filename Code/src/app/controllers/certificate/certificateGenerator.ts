//TODO: Lógica completa de gerar e assinar o certificado vai aqui

import {generateCertificateHTML} from "./htmlGenerator";
import {html2PDF} from "./pdfConverter";
import path from "path";
import fs from "fs";


const templatePath : string = path.join(__dirname, '.', 'template', 'html','templatev0.html');
const outputPathHTML: string = path.join(__dirname, '..', '..', '..', 'output', 'html');
const outputPathPDF: string = path.join(__dirname, '..', '..', '..', 'output', 'pdf');
const template = fs.readFileSync(templatePath, "utf8");

export async function generateCertificates(studentList: any) {
    for (const student of studentList) {
        const certificate = generateCertificateHTML(student, template, outputPathHTML);
        await html2PDF(student, certificate, outputPathPDF);
    }

}

