import express from 'express';


import defaultRoutes from './defaultRoutes.js';
import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';


const router = express.Router();

router.use('/', defaultRoutes);
router.use('/user', userRoutes);
router.use('/product', productRoutes);

export default router;
