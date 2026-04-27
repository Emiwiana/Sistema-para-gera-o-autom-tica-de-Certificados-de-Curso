/// <reference types="node" />
//app to be launched through this file
import Handlebars from "handlebars";
import fs from 'fs';

export function renderTemplate(template: any, data: { nome: string; numero: string; curso: string; data_inicio: string; data_fim: string; }) {
    const templateSource = String(template);
    const compiledTemplate = Handlebars.compile(templateSource);
    const renderedHTML = compiledTemplate(data);
    return renderedHTML;
}
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