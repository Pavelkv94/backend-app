import { Schema, model } from "mongoose";
import { WithId } from "mongodb";
import { PostEntityModel } from "../../features/posts/models/posts.models";

const PostSchema = new Schema<WithId<PostEntityModel>>({
  title: { type: String, require: true },
  shortDescription:{ type: String, require: true },
  content: { type: String, require: true },
  blogId:{ type: String, require: true },
  blogName: { type: String, require: true },
  createdAt: { type: String, require: true },
});

export const PostModel = model<WithId<PostEntityModel>>("posts", PostSchema);
