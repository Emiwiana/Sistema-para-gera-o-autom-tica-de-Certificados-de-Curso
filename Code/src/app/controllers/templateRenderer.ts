import Handlebars from "handlebars";

export function renderTemplate(template: any, data: { nome: string; numero: string; curso: string; data_inicio: string; data_fim: string; }) {
    const templateSource = String(template);
    const compiledTemplate = Handlebars.compile(templateSource);
    const renderedHTML = compiledTemplate(data);
    return renderedHTML;
}