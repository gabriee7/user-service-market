import express from 'express';
import userController from '#controllers/userController.js';
import { validateUser } from '#middlewares/userValidation.js';

const router = express.Router();

router.post('/', validateUser, userController.create);
router.get('/', userController.getAll);
router.get('/:id', userController.get);
router.put('/:id', validateUser, userController.update);
router.delete('/:id', userController.delete);

export default router;
