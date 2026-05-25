import { Request, Response } from 'express';
import { Blog } from '../../models/Blog';
import { User } from '../../models/User';
import { isObjectIdExists } from '../../utils/validation';
import { AuthRequest } from '../../middleware/auth';

export const createBlog = async (req: Request, res: Response) => {
  try {
    const { headline, description, author, datePublished, dateModified, articleSection, keywords, inLanguage } = req.body;

    const userExists = await isObjectIdExists(User, author);
    if (!userExists) {
      return res.status(400).json({
        message: 'Invalid author: User does not exist',
      });
    }

    const blog = await Blog.create({
      headline,
      description,
      author,
      datePublished,
      dateModified,
      articleSection,
      keywords,
      inLanguage,
    });

    res.status(201).json({
      message: 'Blog created successfully',
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating blog',
      error,
    });
  }
};

export const updateBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { headline, description, dateModified, articleSection, keywords, inLanguage } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: 'User not authenticated',
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: 'Blog not found',
      });
    }

    if (blog.author.toString() !== userId) {
      return res.status(403).json({
        message: 'Unauthorized: Only the blog author can update this blog',
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        headline,
        description,
        dateModified,
        articleSection,
        keywords,
        inLanguage,
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Blog updated successfully',
      data: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating blog',
      error,
    });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      message: 'Blog deleted successfully',
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting blog',
      error,
    });
  }
};

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find().populate('author', 'name email');

    res.status(200).json({
      message: 'Blogs fetched successfully',
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching blogs',
      error,
    });
  }
};

export const getBlogsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const blogs = await Blog.find({ author: userId }).populate('author', 'name email');

    res.status(200).json({
      message: 'Blogs fetched successfully',
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching blogs',
      error,
    });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id).populate('author', 'name email');

    if (!blog) {
      return res.status(404).json({
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      message: 'Blog fetched successfully',
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching blog',
      error,
    });
  }
};
