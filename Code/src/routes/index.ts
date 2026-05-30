import express from 'express';
import { router as authRoutes } from './auth';
import { policyEnforce } from '../middlewares/policyEnforce';
import { requireAuth } from '../middlewares/requireAuth';
import { generateTestPdfs, showDashboard } from '../controllers/certificate/certificate';

export const router = express.Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.get('/', requireAuth, showDashboard);
router.get('/test-pdf', requireAuth, policyEnforce, generateTestPdfs);

module.exports = router;