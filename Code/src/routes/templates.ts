import express from 'express';
import { getTemplatePage, getCreateTemplatePage, getEditTemplatePage, createTemplate, updateTemplate, deleteTemplate, previewTemplate } from '../controllers/templates';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

export const router = express.Router();

router.get('/', authenticate, authorize, getTemplatePage);
router.get('/create', authenticate, authorize, getCreateTemplatePage);
router.get('/edit/:id', authenticate, authorize, getEditTemplatePage);

router.post('/create', authenticate, authorize, createTemplate);
router.post('/update', authenticate, authorize, updateTemplate);
router.post('/delete', authenticate, authorize, deleteTemplate);
router.post('/preview', authenticate, authorize, previewTemplate);
