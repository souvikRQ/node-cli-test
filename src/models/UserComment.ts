import mongoose, { Schema } from 'mongoose';

const userCommentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    dateCreated: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserComment = mongoose.model('UserComment', userCommentSchema);
