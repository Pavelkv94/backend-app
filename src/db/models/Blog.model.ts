import { Schema, model } from "mongoose";
import { WithId } from "mongodb";
import { BlogEntityModel } from "../../features/blogs/models/blogs.models";

const BlogSchema = new Schema<WithId<BlogEntityModel>>({
  name: { type: String, require: true },
  description: { type: String, require: true },
  websiteUrl: { type: String, require: true },
  isMembership: { type: Boolean, require: true },
  createdAt: { type: String, require: true },
});

export const BlogModel = model<WithId<BlogEntityModel>>("blogs", BlogSchema);
