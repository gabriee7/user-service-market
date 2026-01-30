import express from 'express';


import defaultRoutes from '@routes/defaultRoutes.js';
import userRoutes from '@routes/userRoutes.js';
import productRoutes from '@routes/productRoutes.js';


const router = express.Router();

router.use('/', defaultRoutes);
router.use('/user', userRoutes);
router.use('/product', productRoutes);

export default router;
