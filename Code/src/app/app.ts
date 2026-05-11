/// <reference types="node" />
//app to be launched through this file
import {generatePDFs} from "./controllers/pdfConverter";
import fs from 'fs';
import {renderTemplate} from "./controllers/templateRenderer";

const template = fs.readFileSync("src\\app\\template\\templatev0.html", "utf8");

const renderedHTML = renderTemplate(template, {
    nome: "Nilo Duarte",
    numero: "48155",
    curso: "LEIM",
    data_inicio: "12-09-2023",
    data_fim: "17-07-2026"
});

const list = [
    { nome: "Nilo Duarte", numero: "48155", curso: "LEIM", data_inicio: "12-09-2023", data_fim: "17-07-2026" },
    { nome: "Maria Silva", numero: "48156", curso: "LEIM", data_inicio: "12-09-2023", data_fim: "17-07-2026" },
    { nome: "João Pereira", numero: "48157", curso: "LEIM", data_inicio: "12-09-2023", data_fim: "17-07-2026" }
];

for (const item of list) {
    const renderedHTML = renderTemplate(template, item);
    fs.writeFileSync(`src\\app\\output\\certificado_${item.numero}.html`, renderedHTML, "utf8");
}

//fs.writeFileSync("certificado.html", renderedHTML, "utf8");

generatePDFs()



