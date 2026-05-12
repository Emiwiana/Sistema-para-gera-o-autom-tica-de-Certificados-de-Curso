import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import {pathToFileURL} from "node:url";

export async function html2PDF(student: any, certificatePath: string, outputPathPDF: string) {
    const fileName:string = 'certificado_' + student.id + '.pdf';
    const fullOutputPath = path.join(outputPathPDF, fileName);
    const absoluteHtmlPath = path.resolve(certificatePath);
    const fileUrl = pathToFileURL(absoluteHtmlPath).href;
    
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
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
    await browser.close();

    console.log(`PDF Generated for ${student.name}: ${fileName}`);
}
