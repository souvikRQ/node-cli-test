import { Request, Response } from 'express';
import { Comment } from '../../models/Comment';
import { Blog } from '../../models/Blog';
import { User } from '../../models/User';
import { isObjectIdExists } from '../../utils/validation';
import { AuthRequest } from '../../middleware/auth';

export const addComment = async (req: Request, res: Response) => {
  try {
    const { blogId, author, dateCreated, text, url } = req.body;

    const blogExists = await isObjectIdExists(Blog, blogId);
    if (!blogExists) {
      return res.status(400).json({
        message: 'Invalid blogId: Blog does not exist',
      });
    }

    const userExists = await isObjectIdExists(User, author);
    if (!userExists) {
      return res.status(400).json({
        message: 'Invalid author: User does not exist',
      });
    }

    const comment = await Comment.create({
      blogId,
      author,
      dateCreated,
      text,
      url,
    });

    res.status(201).json({
      message: 'Comment added successfully',
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding comment',
      error,
    });
  }
};

export const getCommentsByBlogId = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.find({ blogId }).populate('author', 'name email');

    res.status(200).json({
      message: 'Comments fetched successfully',
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching comments',
      error,
    });
  }
};

export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id: blogId, commentId } = req.params;
    const { text, url } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'User not authenticated',
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: 'Comment not found',
      });
    }

    if (comment.blogId.toString() !== blogId) {
      return res.status(400).json({
        message: 'Invalid blogId: Comment does not belong to this blog',
      });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({
        message: 'Unauthorized: Only the comment author can update this comment',
      });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { text, url },
      { new: true }
    );

    res.status(200).json({
      message: 'Comment updated successfully',
      data: updatedComment,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating comment',
      error,
    });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id: blogId, commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'User not authenticated',
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: 'Comment not found',
      });
    }

    if (comment.blogId.toString() !== blogId) {
      return res.status(400).json({
        message: 'Invalid blogId: Comment does not belong to this blog',
      });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({
        message: 'Unauthorized: Only the comment author can delete this comment',
      });
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    res.status(200).json({
      message: 'Comment deleted successfully',
      data: deletedComment,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting comment',
      error,
    });
  }
};
