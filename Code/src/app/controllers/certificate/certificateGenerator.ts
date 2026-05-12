import path from "path";
import fs from "fs";
import {pathToFileURL} from "node:url";
import puppeteer, {Page} from "puppeteer";
import Handlebars from "handlebars";


const templatePath : string = path.join(__dirname, 'template', 'html','templatev0.html');
const tempCertificatePath: string = path.join(__dirname, 'template', 'html', 'temp_certificate.html');
const outputPathPDF: string = path.join(__dirname, '..', '..', '..', 'output');
const template = fs.readFileSync(templatePath, "utf8");

export async function generatePdfCertificates(studentList: any) {
    //starts puppeteer
    const browser = await puppeteer.launch({
        headless: true
    });

    try {
        for (const student of studentList) {
            generateTempHTML(student);                   // creates temp html certificate
            const page = await browser.newPage(); // creates new empty page to put html in
            await generatePDF(student, page)            // generates pdf file based on temp html
            signCertificate(student);                   // TODO: sign the generated certificate
        }
    } catch (error) {
        // @ts-ignore
        console.log(error.stack);
    }
    finally {
        //Closes Puppeteer and deletes temp html file
        fs.unlink(tempCertificatePath, (err) => {})
        await browser.close();
    }
}

async function generatePDF(student:any, page:Page) {

    const fileName: string = 'certificado_' + student.id + '.pdf';
    const fullOutputPath = path.join(outputPathPDF, fileName);
    const fileUrl = pathToFileURL(path.resolve(tempCertificatePath)).href;

    await page.goto(fileUrl, {
            waitUntil: "networkidle0"
        }
    );

    await page.pdf({
        path: fullOutputPath,
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        landscape: true,
        margin: {
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px'
        }
    });

    console.log(`PDF Generated for ${student.name}: ${fileName}`);
}

function generateTempHTML(student : any) {
    //TODO Alterar lógica para usar classe estudante em vez de inputs da lista
    const renderedHTML = fillTemplate(template, student);
    fs.writeFileSync(tempCertificatePath, renderedHTML, "utf8");
}

function fillTemplate(template: any, data: { name: string; id: string; curso: string; data_inicio: string; data_fim: string; }) {
    const templateSource = String(template);
    const compiledTemplate = Handlebars.compile(templateSource);
    return compiledTemplate(data);
}

function signCertificate(student : any) : void {
    //TODO: Lógica de assinar o certificado
}