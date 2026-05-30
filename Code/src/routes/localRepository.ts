import {authenticate} from "../middlewares/authenticate";
import {deleteCertificate, getMaintenancePage, scheduleDeletion} from "../controllers/localRepository";
import {authorize} from "../middlewares/authorize";
import express from 'express';

export const router = express.Router();

router.get('/maintenance', authenticate, authorize, getMaintenancePage);
router.post('/maintenance/delete', authenticate, authorize, deleteCertificate);
router.post('/maintenance/schedule', authenticate, authorize, scheduleDeletion);