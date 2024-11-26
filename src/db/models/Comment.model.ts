import { Schema, model } from "mongoose";
import { WithId } from "mongodb";
import { CommentEntityModel } from "../../features/comments/models/comments.models";

const CommentSchema = new Schema<WithId<CommentEntityModel>>({
  content: { type: String, require: true },
  postId: { type: String, require: true },
  commentatorInfo: {
    userId: { type: String, require: true },
    userLogin: { type: String, require: true },
  },
  createdAt: { type: String, require: true },
  likesInfo: {
    likesCount: { type: Number, require: true },
    dislikesCount: { type: Number, require: true },
  },
});

export const CommentModel = model<WithId<CommentEntityModel>>("comments", CommentSchema);
