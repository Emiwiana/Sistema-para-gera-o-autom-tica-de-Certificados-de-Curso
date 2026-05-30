import express from 'express';
import {authorize} from "../middlewares/authorize";
import {getGeneratePage, handleGenerateSubmit} from "../controllers/certificates";
import {authenticate} from "../middlewares/authenticate";
export const router = express.Router();

router.get('/generate', authenticate, authorize, getGeneratePage);
router.post('/generate', authenticate, authorize, handleGenerateSubmit);


