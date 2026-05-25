import { Router } from 'express';
import { blogController, commentBlogController } from '../controllers';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Blog routes
router.post('/', authMiddleware, blogController.createBlog);
router.get('/', blogController.getAllBlogs);
router.get('/user/:userId', blogController.getBlogsByUserId);
router.get('/:id', blogController.getBlogById);
router.put('/:id', authMiddleware, blogController.updateBlog);
router.delete('/:id', authMiddleware, blogController.deleteBlog);

// Comment routes
router.post('/:id/comments', authMiddleware, commentBlogController.addComment);
router.get('/:id/comments', commentBlogController.getCommentsByBlogId);
router.put('/:id/comments/:commentId', authMiddleware, commentBlogController.updateComment);
router.delete('/:id/comments/:commentId', authMiddleware, commentBlogController.deleteComment);

export default router;
