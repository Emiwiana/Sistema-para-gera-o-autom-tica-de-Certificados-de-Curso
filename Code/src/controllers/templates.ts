import {Request, Response} from 'express';
import {Template, TemplateLayout, TemplateElement} from '../model/template';
import {TemplateDAO} from '../dao/implementations/local/templateDAO';
import {ITemplateDAO} from '../dao/interfaces/ITemplateDAO';
import {prepareElementsForRender} from '../services/certificate/renderHelper';

const templateDAO: ITemplateDAO = new TemplateDAO();


function buildLayoutFromForm(body: Record<string, any>): TemplateLayout {
    const page = {
        backgroundColor: body.backgroundColor || '#dbf2ff',
        borderColor:     body.borderColor     || '#2655b5',
        borderWidth:     parseInt(body.borderWidth, 10) || 20,
    };

    const elements: TemplateElement[] = [
        {
            id: 'title',
            type: 'text',
            content:    body.titleText       || 'Certificado',
            x:          parseInt(body.titleX, 10)        || 700,
            y:          parseInt(body.titleY, 10)        || 100,
            fontSize:   parseInt(body.titleFontSize, 10) || 60,
            fontFamily: body.titleFontFamily || 'Impact',
            color:      body.titleColor      || '#2655b5',
        },
        {
            id: 'intro',
            type: 'text',
            content:    body.introText       || 'Certifica-se que',
            x:          parseInt(body.introX, 10)        || 700,
            y:          parseInt(body.introY, 10)        || 250,
            fontSize:   parseInt(body.introFontSize, 10) || 30,
            fontFamily: body.introFontFamily || 'Haettenschweiler',
            color:      body.introColor      || '#2655b5',
        },
        {
            id: 'studentName',
            type: 'placeholder',
            placeholder: 'name',
            x:          parseInt(body.studentNameX, 10)        || 700,
            y:          parseInt(body.studentNameY, 10)        || 330,
            fontSize:   parseInt(body.studentNameFontSize, 10) || 30,
            fontFamily: body.studentNameFontFamily || 'Arial Narrow Bold',
            color:      body.studentNameColor      || '#2655b5',
        },
        {
            id: 'mainText',
            type: 'text',
            content:    body.mainText || 'aluno com o número: {{id}} terminou o curso {{curso}}. O curso teve início em {{data_inicio}} e terminou em {{data_fim}}.',
            x:          parseInt(body.mainTextX, 10)        || 700,
            y:          parseInt(body.mainTextY, 10)        || 450,
            fontSize:   parseInt(body.mainTextFontSize, 10) || 20,
            fontFamily: body.mainTextFontFamily || 'Arial Narrow Bold',
            color:      body.mainTextColor      || '#2655b5',
        },
        {
            id: 'congratulations',
            type: 'text',
            content:    body.congratulationsText || 'Muitos parabéns!',
            x:          parseInt(body.congratulationsX, 10)        || 700,
            y:          parseInt(body.congratulationsY, 10)        || 650,
            fontSize:   parseInt(body.congratulationsFontSize, 10) || 50,
            fontFamily: body.congratulationsFontFamily || 'Haettenschweiler',
            fontStyle:  'italic',
            color:      body.congratulationsColor      || '#2655b5',
        },
        {
            id: 'signature',
            type: 'text',
            content:    body.signatureText || 'Assinatura do Responsável',
            x:          parseInt(body.signatureX, 10)        || 1200,
            y:          parseInt(body.signatureY, 10)        || 900,
            fontSize:   parseInt(body.signatureFontSize, 10) || 30,
            fontFamily: body.signatureFontFamily || 'Arial Narrow Bold',
            color:      body.signatureColor      || '#2655b5',
            borderWidth: 5,
            borderColor: body.signatureBorderColor || '#2655b5',
        },
    ];

    return { page, elements };
}


 // Helper: find an element by id within a layout, returning a fallback empty object if missing.
 
function findElement(layout: TemplateLayout, elementId: string): TemplateElement {
    return layout.elements.find(e => e.id === elementId) || {
        id: elementId, type: 'text', x: 0, y: 0
    };
}



export const getTemplatePage = async (req: Request, res: Response) => {
    const templates = await templateDAO.getAllTemplates();
    res.render('templates/index', { templates });
};

export const getCreateTemplatePage = (req: Request, res: Response) => {
    res.render('templates/create');
};
    
export const getEditTemplatePage = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).send("Invalid template id");
    }

    const template = await templateDAO.getTemplateById(id);

    if (!template) {
        return res.status(404).send("Template not found");
    }

    // Pre-extract elements for the view so it doesn't have to search
    const layout = template.layout;
    const elements = {
        title:          findElement(layout, 'title'),
        intro:          findElement(layout, 'intro'),
        studentName:    findElement(layout, 'studentName'),
        mainText:       findElement(layout, 'mainText'),
        congratulations:findElement(layout, 'congratulations'),
        signature:      findElement(layout, 'signature'),
    };
    const images = layout.elements.filter(e => e.type === 'image');

    res.render("templates/edit", { template, elements, images });
};



export const createTemplate = async (req: Request, res: Response) => {
    const { name } = req.body;
    const layout = buildLayoutFromForm(req.body);
    const newTemplate = new Template(Date.now(), name, layout);
    await templateDAO.saveTemplate(newTemplate);
    res.redirect('/templates');
}; 

export const updateTemplate = async (req: Request, res: Response) => {
    const { id, name } = req.body;
    const numericId = parseInt(id, 10);
    const layout = buildLayoutFromForm(req.body);
    const updatedTemplate = new Template(numericId, name, layout);
    await templateDAO.updateTemplate(updatedTemplate);
    res.redirect(`/templates/edit/${numericId}`);
};

export const deleteTemplate = async (req: Request, res: Response) => {
    const { id } = req.body;
    await templateDAO.deleteTemplate(parseInt(id, 10));
    res.redirect('/templates');
};



export const previewTemplate = async (req: Request, res: Response) => {
    let layout: TemplateLayout;

    if (req.body && req.body.titleText) {
        // Build layout from form fields (for unsaved / in-progress templates)
        layout = buildLayoutFromForm(req.body);
    } else if (req.query.id) {
        // Load an existing template by ID
        const id = Number(req.query.id);
        const template = await templateDAO.getTemplateById(id);
        if (!template) {
            return res.status(404).send("Template not found");
        }
        layout = template.layout;
    } else {
        return res.status(400).send("No template data provided");
    }

    // Provide sample placeholder data for preview
    const placeholderData: Record<string, string> = {
        name: 'João Silva',
        id: '12345',
        curso: 'Engenharia Informática',
        data_inicio: '01/09/2024',
        data_fim: '30/06/2025',
    };

    const elements = prepareElementsForRender(layout, placeholderData);

    res.render('templates/preview', { layout, elements });
};
