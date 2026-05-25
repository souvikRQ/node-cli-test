import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { UserComment } from '../../models/UserComment';
import { ensureString } from '../../utils/string';

export const addUserComment = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { text } = req.body;
    const authorId = ensureString((req as any).user?.id);

    if (!userId || !text || !authorId) {
      return res.status(400).json({
        message: 'Missing required fields: userId, text, and authentication',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId as string)) {
      return res.status(400).json({
        message: 'Invalid user ID',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(authorId as string)) {
      return res.status(400).json({
        message: 'Invalid author ID',
      });
    }

    const comment = await UserComment.create({
      userId,
      author: authorId,
      text,
      dateCreated: new Date(),
    });

    await comment.populate('author', 'name email');

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

export const getUserCommentsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        message: 'Missing userId parameter',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId as string)) {
      return res.status(400).json({
        message: 'Invalid user ID',
      });
    }

    const comments = await UserComment.find({ userId }).populate('author', 'name email');

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

export const deleteUserComment = async (req: Request, res: Response) => {
  try {
    const { userId, commentId } = req.params;
    const authorId = ensureString((req as any).user?.id);

    if (!userId || !commentId || !authorId) {
      return res.status(400).json({
        message: 'Missing required parameters or authentication',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId as string)) {
      return res.status(400).json({
        message: 'Invalid comment ID',
      });
    }

    const comment = await UserComment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: 'Comment not found',
      });
    }

    if (comment.author.toString() !== authorId) {
      return res.status(403).json({
        message: 'Unauthorized: You can only delete your own comments',
      });
    }

    await UserComment.findByIdAndDelete(commentId);

    res.status(200).json({
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting comment',
      error,
    });
  }
};

export const updateUserComment = async (req: Request, res: Response) => {
  try {
    const { userId, commentId } = req.params;
    const { text } = req.body;
    const authorId = ensureString((req as any).user?.id);

    if (!userId || !commentId || !authorId || !text) {
      return res.status(400).json({
        message: 'Missing required fields or authentication',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(commentId as string)) {
      return res.status(400).json({
        message: 'Invalid comment ID',
      });
    }

    const comment = await UserComment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        message: 'Comment not found',
      });
    }

    if (comment.author.toString() !== authorId) {
      return res.status(403).json({
        message: 'Unauthorized: You can only update your own comments',
      });
    }

    const updatedComment = await UserComment.findByIdAndUpdate(
      commentId,
      { text },
      { new: true }
    ).populate('author', 'name email');

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
