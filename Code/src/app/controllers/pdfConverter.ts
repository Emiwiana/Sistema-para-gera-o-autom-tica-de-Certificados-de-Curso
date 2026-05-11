import fs from "fs";
import puppeteer from 'puppeteer';

async function generatePDFs() {

    const files = fs.readdirSync("src/app/output");

    for (const file of files) {

        if (!file.endsWith(".html")) continue;

        const browser = await puppeteer.launch({
            headless: true
        });

        const page = await browser.newPage();

        page.on("console", msg => console.log(msg.text()));
        page.on("pageerror", err => console.log(err));

        await page.goto(
            `http://localhost:5500/src/app/output/${file}`,
            {
                waitUntil: "networkidle0"
            }
        );

        await page.pdf({
            path: `src/app/output/${file.replace(".html", ".pdf")}`,
            format: "A4",
            printBackground: true,
            preferCSSPageSize: true
        });

        await browser.close();

        console.log(`${file} convertido para PDF`);
    }

    module.exports = {generatePDFs}
}