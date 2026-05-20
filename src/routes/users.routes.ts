import { Router } from 'express';
import { authController, userController } from '../controllers';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes - Authentication
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes - User CRUD
router.get('/me', authMiddleware, userController.getCurrentUser);
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

export default router;
