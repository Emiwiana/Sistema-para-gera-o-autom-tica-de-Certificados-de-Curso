import express from 'express';
import { router as authRoutes } from './auth';
import {router as repositoryRoutes} from './localRepository'

import { authorize } from '../middlewares/authorize';
import { authenticate } from '../middlewares/authenticate';
import { generateTestPdfs } from '../controllers/certificate';
import {showDashboard} from "../controllers/dashboard";

export const router = express.Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.get('/', authenticate, showDashboard);
router.get('/test-pdf', authenticate, authorize, generateTestPdfs);
router.use('/admin', repositoryRoutes)


module.exports = router;