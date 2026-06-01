import {authenticate} from "../middlewares/authenticate";
import {deleteBeforeDate, deleteCertificateBeforeStudentNumber, deleteNow, getMaintenancePage, scheduleDeletion, deleteCertificatesByCourse} from "../controllers/maintenance";
import {authorize} from "../middlewares/authorize";
import express from 'express';

export const router = express.Router();

router.get('/maintenance', authenticate, authorize, getMaintenancePage);
router.post('/maintenance/delete', authenticate, authorize, deleteNow);
router.post('/maintenance/schedule', authenticate, authorize, scheduleDeletion);
router.post('/maintenance/delete-before', authenticate, authorize, deleteBeforeDate);
router.post('/maintenance/delete-before-student-number', authenticate, authorize, deleteCertificateBeforeStudentNumber);
router.post('/maintenance/delete-by-course', authenticate, authorize, deleteCertificatesByCourse);