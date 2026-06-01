import {authenticate} from "../middlewares/authenticate";
import {deleteBeforeDate, deleteBeforeStudentNumber, deleteNow, getMaintenancePage, scheduleDeletion, deleteByCourse} from "../controllers/maintenance";
import {authorize} from "../middlewares/authorize";
import express from 'express';

export const router = express.Router();

router.get('/maintenance', authenticate, authorize, getMaintenancePage);
router.post('/maintenance/delete', authenticate, authorize, deleteNow);
router.post('/maintenance/schedule', authenticate, authorize, scheduleDeletion);
router.post('/maintenance/delete-before', authenticate, authorize, deleteBeforeDate);
router.post('/maintenance/delete-before-student-number', authenticate, authorize, deleteBeforeStudentNumber);
router.post('/maintenance/delete-by-course', authenticate, authorize, deleteByCourse);