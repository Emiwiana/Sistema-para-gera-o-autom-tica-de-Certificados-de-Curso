import { ITemplateDAO } from "../../dao/interfaces/ITemplateDAO";
import { TemplateDAO } from "../../dao/implementations/local/templateDAO";
import { Template, TemplateElement, TemplateLayout } from "../../model/template";

const dao: ITemplateDAO = new TemplateDAO();

export function buildLayoutFromForm(body: Record<string, any>): TemplateLayout {
    const page = {
        backgroundColor: body.backgroundColor || '#dbf2ff',
        borderColor: body.borderColor || '#2655b5',
        borderWidth: parseInt(body.borderWidth, 10) || 20,
    };

    const elements: TemplateElement[] = [
        {
            id: 'title',
            type: 'text',
            content: body.titleText || 'Certificado',
            x: parseInt(body.titleX, 10) || 700,
            y: parseInt(body.titleY, 10) || 100,
            fontSize: parseInt(body.titleFontSize, 10) || 60,
            fontFamily: body.titleFontFamily || 'Impact',
            color: body.titleColor || '#2655b5',
        },
        {
            id: 'intro',
            type: 'text',
            content: body.introText || 'Certifica-se que',
            x: parseInt(body.introX, 10) || 700,
            y: parseInt(body.introY, 10) || 250,
            fontSize: parseInt(body.introFontSize, 10) || 30,
            fontFamily: body.introFontFamily || 'Haettenschweiler',
            color: body.introColor || '#2655b5',
        },
        {
            id: 'studentName',
            type: 'placeholder',
            placeholder: 'name',
            x: parseInt(body.studentNameX, 10) || 700,
            y: parseInt(body.studentNameY, 10) || 330,
            fontSize: parseInt(body.studentNameFontSize, 10) || 30,
            fontFamily: body.studentNameFontFamily || 'Arial Narrow Bold',
            color: body.studentNameColor || '#2655b5',
        },
        {
            id: 'mainText',
            type: 'text',
            content: body.mainText || 'aluno com o número: {{id}} terminou o curso {{curso}}. O curso teve início em {{data_inicio}} e terminou em {{data_fim}}.',
            x: parseInt(body.mainTextX, 10) || 700,
            y: parseInt(body.mainTextY, 10) || 450,
            fontSize: parseInt(body.mainTextFontSize, 10) || 20,
            fontFamily: body.mainTextFontFamily || 'Arial Narrow Bold',
            color: body.mainTextColor || '#2655b5',
        },
        {
            id: 'congratulations',
            type: 'text',
            content: body.congratulationsText || 'Muitos parabéns!',
            x: parseInt(body.congratulationsX, 10) || 700,
            y: parseInt(body.congratulationsY, 10) || 650,
            fontSize: parseInt(body.congratulationsFontSize, 10) || 50,
            fontFamily: body.congratulationsFontFamily || 'Haettenschweiler',
            fontStyle: 'italic',
            color: body.congratulationsColor || '#2655b5',
        },
        {
            id: 'signature',
            type: 'text',
            content: body.signatureText || 'Assinatura do Responsável',
            x: parseInt(body.signatureX, 10) || 1200,
            y: parseInt(body.signatureY, 10) || 900,
            fontSize: parseInt(body.signatureFontSize, 10) || 30,
            fontFamily: body.signatureFontFamily || 'Arial Narrow Bold',
            color: body.signatureColor || '#2655b5',
            borderWidth: 5,
            borderColor: body.signatureBorderColor || '#2655b5',
        },
    ];

    if (body.imagesJson && body.imagesJson.trim() !== '') {
        try {
            const images = JSON.parse(body.imagesJson);
            if (Array.isArray(images)) {
                for (const img of images) {
                    if (img && img.type === 'image') {
                        elements.push({
                            id: img.id || `image_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                            type: 'image',
                            src: img.src || '',
                            x: parseInt(img.x, 10) || 100,
                            y: parseInt(img.y, 10) || 100,
                            width: parseInt(img.width, 10) || 150,
                            height: parseInt(img.height, 10) || 150
                        });
                    }
                }
            }
        } catch (e) {
            console.error("Failed to parse imagesJson:", e);
        }
    }

    return { page, elements };
}

export async function getAllTemplates() {
    return await dao.getAllTemplates();
}

export async function getTemplateByID(id: number) {
    return await dao.getTemplateById(id);
}

export async function createTemplate(name: string, layout: TemplateLayout) {
    const newTemplate = new Template(Date.now(), name, layout);
    await dao.saveTemplate(newTemplate);
}

export async function updateTemplate(id: number, name: string, layout: TemplateLayout) {
    const updatedTemplate = new Template(id, name, layout);
    await dao.updateTemplate(updatedTemplate);
}

export async function deleteTemplate(id: number) {
    await dao.deleteTemplate(id);
}

export function findElement(layout: TemplateLayout, elementId: string): TemplateElement {
    return layout.elements.find(e => e.id === elementId) || {
        id: elementId, type: 'text', x: 0, y: 0
    };
}