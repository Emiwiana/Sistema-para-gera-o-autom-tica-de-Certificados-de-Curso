import express from 'express';
import { router as authRoutes } from './auth';
import {router as maintenanceRoutes} from './maintenance'
import {router as certificateRoutes} from './certificates'

import { authenticate } from '../middlewares/authenticate';
import {showDashboard} from "../controllers/dashboard";

export const router = express.Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.get('/', authenticate, showDashboard);
router.use('/admin', maintenanceRoutes)
router.use('/certificates', certificateRoutes)

module.exports = router;