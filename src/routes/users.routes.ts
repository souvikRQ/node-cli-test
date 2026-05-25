import { Router } from 'express';
import { authController, userController, commentController } from '../controllers';
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

// User comment routes
router.post('/:userId/comments', authMiddleware, commentController.addUserComment);
router.get('/:userId/comments', commentController.getUserCommentsByUserId);
router.delete('/:userId/comments/:commentId', authMiddleware, commentController.deleteUserComment);
router.put('/:userId/comments/:commentId', authMiddleware, commentController.updateUserComment);

export default router;
