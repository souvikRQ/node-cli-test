import mongoose, { Schema } from 'mongoose';

const blogSchema = new Schema(
  {
    headline: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    datePublished: {
      type: Date,
      required: true,
    },
    dateModified: {
      type: Date,
      required: true,
    },
    articleSection: {
      type: String,
      required: true,
    },
    keywords: {
      type: [String],
      required: true,
    },
    inLanguage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Blog = mongoose.model('Blog', blogSchema);
