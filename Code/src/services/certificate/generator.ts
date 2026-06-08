import path from "path";
import fs from "fs";
import {pathToFileURL} from "node:url";
import puppeteer, {Page} from "puppeteer";
import {Student} from "../../model/student";
import {CertificateRepositoryDir} from "../../configs/localRepository";
import {TemplateLayout} from "../../model/template";
import {prepareElementsForRender} from "./renderHelper";

const tempCertificatePath: string = path.join(__dirname, 'template', 'html', 'temp_certificate.html');

export async function generatePdfCertificates(students: Student[], layout: TemplateLayout) {
    // ensures directory exists
    fs.mkdirSync(CertificateRepositoryDir, { recursive: true });

    // ensure temp html directory exists
    fs.mkdirSync(path.dirname(tempCertificatePath), { recursive: true });

    // starts puppeteer
    const browser = await puppeteer.launch({
        headless: true,
        // disable needless UI features
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    // process certificates in batches
    const batchSize = 5;
    for (let i = 0; i < students.length; i += batchSize) {
        const batch = students.slice(i, i + batchSize);

        await Promise.all(batch.map(async (student) => {
            const page = await browser.newPage();

            try {
                await generateTempHTML(layout, student);           // creates temp html certificate
                await generatePDF(student, page);                  // generates pdf file based on temp html
                await signCertificate(student);                    // TODO: sign the generated certificate
            } catch (err) {
                console.error(`Failed to generate for ${student.name}:`, err);
            } finally {
                fs.unlink(tempCertificatePath, (err) => {})
                await page.close();
            }
        }));
    }

    await browser.close();
}

async function generatePDF(student : Student, page:Page) {
    const fileName: string = student.certificateFileName;
    const fullOutputPath = path.join(CertificateRepositoryDir, fileName);
    const fileUrl = pathToFileURL(path.resolve(tempCertificatePath)).href;

    await page.goto(fileUrl, {
        waitUntil: "networkidle0"
    });

    await page.pdf({
        path: fullOutputPath,
        width: '1485px',
        height: '1050px',
        printBackground: true,
        margin: {
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px'
        }
    });

    console.log(`PDF Generated for ${student.name}: ${fileName}`);
}

async function generateTempHTML(layout: TemplateLayout, student: Student) {
    const renderedHTML = renderLayoutToHtml(layout, student);
    fs.writeFileSync(tempCertificatePath, renderedHTML, "utf8");
}

function renderLayoutToHtml(layout: TemplateLayout, student: Student): string {
    const data = {
        name: student.name,
        id: student.id,
        curso: student.course.name,
        data_inicio: student.course.startDate,
        data_fim: student.course.endDate
    };
    const elements = prepareElementsForRender(layout, data);

    const elementsHtml = elements.map(element => {
        if (element.isImage) {
            return `<div class="template-element image-element" style="${element.style}">
                <img src="${element.content}" style="width: 100%; height: 100%; object-fit: contain;" />
            </div>`;
        } else if (element.isSignature) {
            return `<div class="template-element signature-box ${element.isCentered ? 'template-element-centered' : ''}" style="${element.style}">
                <div style="border-top: 2px solid ${layout.page.borderColor}; padding-top: 5px; text-align: center;">
                    ${element.content}
                </div>
            </div>`;
        } else {
            return `<div class="template-element ${element.isCentered ? 'template-element-centered' : ''}" style="${element.style}">
                ${element.content}
            </div>`;
        }
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <title>Certificado</title>
    <style>
        @page {
            size: 1485px 1050px;
            margin: 0;
        }
        html, body {
            margin: 0;
            padding: 0;
            width: 1485px;
            height: 1050px;
            background-color: #eaeaea;
            font-family: Arial, sans-serif;
            -webkit-print-color-adjust: exact;
        }

        .certificate-canvas {
            width: 1485px;
            height: 1050px;
            position: relative;
            box-sizing: border-box;
            background-color: ${layout.page.backgroundColor};
            border: ${layout.page.borderWidth}px solid ${layout.page.borderColor};
            overflow: hidden;
        }

        .template-element {
            position: absolute;
            margin: 0;
            padding: 0;
            white-space: nowrap;
        }

        .template-element-centered {
            left: 50% !important;
            transform: translateX(-50%);
            text-align: center;
        }
    </style>
</head>
<body>
<div class="certificate-canvas">
    ${elementsHtml}
</div>
</body>
</html>`;
}

async function signCertificate(student : Student)  {
    // TODO: Lógica de assinar o certificado
}