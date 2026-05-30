import {authenticate} from "../middlewares/authenticate";
import {deleteNow, getMaintenancePage, scheduleDeletion} from "../controllers/maintenance";
import {authorize} from "../middlewares/authorize";
import express from 'express';

export const router = express.Router();

router.get('/maintenance', authenticate, authorize, getMaintenancePage);
router.post('/maintenance/delete', authenticate, authorize, deleteNow);
router.post('/maintenance/schedule', authenticate, authorize, scheduleDeletion);