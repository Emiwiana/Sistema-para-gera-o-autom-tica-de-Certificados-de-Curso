import path from "path";
import fs from "fs";
import {pathToFileURL} from "node:url";
import puppeteer from "puppeteer";
import Handlebars from "handlebars";


const templatePath : string = path.join(__dirname, '.', 'template', 'html','templatev0.html');
const tempFilePath: string = path.join(__dirname, '..', '..', '..', 'output', 'html');
const outputPathPDF: string = path.join(__dirname, '..', '..', '..', 'output');
const template = fs.readFileSync(templatePath, "utf8");

export async function generatePdfCertificates(studentList: any) {
    const browser = await puppeteer.launch({
        headless: true
    });

    try {
        for (const student of studentList) {
            const page = await browser.newPage();
            //TODO: Clean up and document this code
            const tempCertificatePath = generateTempHTML(student, template, tempFilePath);
            const fileUrl = pathToFileURL(path.resolve(tempCertificatePath)).href;

            const fileName:string = 'certificado_' + student.id + '.pdf';
            const fullOutputPath = path.join(outputPathPDF, fileName);

            page.on("console", msg => console.log(msg.text()));
            page.on("pageerror", err => console.log(err));
            await page.goto(fileUrl, {
                    waitUntil: "networkidle0"
                }
            );
            await page.pdf({
                path: fullOutputPath,
                format: "A4",
                printBackground: true,
                preferCSSPageSize: true
            });

            fs.unlink(tempCertificatePath, (err) => {});
            console.log(`PDF Generated for ${student.name}: ${fileName}`);
            signCertificate(fullOutputPath);
        }
    } catch (error) {}
    finally {
        await browser.close();
    }
}

function generateTempHTML(student : any, template : any, outputPath : string) : string {
    //TODO Alterar lógica para usar classe estudante em vez de inputs da lista
    const renderedHTML = fillCertificateTemplate(template, student);
    const certificateName : string = 'temp_certificate';
    const certificatePath = `${outputPath}${certificateName}`;
    fs.writeFileSync(certificatePath, renderedHTML, "utf8");
    return certificatePath
}

function fillCertificateTemplate(template: any, data: { nome: string; numero: string; curso: string; data_inicio: string; data_fim: string; }) {
    const templateSource = String(template);
    const compiledTemplate = Handlebars.compile(templateSource);
    return compiledTemplate(data);
}

function signCertificate(pdfPath : string) : void {
    //TODO: Lógica de assinar o certificado
}