import Handlebars from "handlebars";
import fs from "fs";

export function generateCertificateHTML(student : any, template : any, outputPath : string) : string {
    //TODO Alterar lógica para usar classe estudante em vez de inputs da lista
    const renderedHTML = renderTemplate(template, student);
    const certificateName : string = '\\certificado_' + student.id + '.html';
    const certificatePath = `${outputPath}${certificateName}`;
    fs.writeFileSync(certificatePath, renderedHTML, "utf8");
    return certificatePath
}

function renderTemplate(template: any, data: { nome: string; numero: string; curso: string; data_inicio: string; data_fim: string; }) {
    const templateSource = String(template);
    const compiledTemplate = Handlebars.compile(templateSource);
    return compiledTemplate(data);
}