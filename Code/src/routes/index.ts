import express from 'express';
export const router = express.Router();



router.use('/auth', authRoutes);

router.get('/', (req, res) => {
    res.redirect('/tasks');
});

module.exports = router;
