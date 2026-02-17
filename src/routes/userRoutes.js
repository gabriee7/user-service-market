import express from 'express';
import userController from '#controllers/userController.js';
import { validateUserCreate, validateUserUpdate, validateChangePassword } from '#middlewares/userValidation.js';
import authMiddleware from '#middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', validateUserCreate, userController.create);
router.get('/', userController.getAll);
router.get('/me', authMiddleware, userController.getMe);
router.put('/me', authMiddleware, validateUserUpdate, userController.updateMe);
router.put('/me/password', authMiddleware, validateChangePassword, userController.changePasswordMe);
router.get('/:id', userController.get);
router.put('/:id/password', authMiddleware, validateChangePassword, userController.changePassword);
router.delete('/:id', authMiddleware, userController.delete);

export default router;
