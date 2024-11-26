import { Schema, model } from "mongoose";
import { WithId } from "mongodb";
import { LikeEntityModel } from "../../features/likes/models/like.model";

const LikeSchema = new Schema<WithId<LikeEntityModel>>({
  user_id: { type: String, require: true },
  parent_id: { type: String, require: true },
  status: { type: String, require: true, default: "None" },
  updatedAt: { type: String, required: true },
});

export const LikeModel = model<WithId<LikeEntityModel>>("likes", LikeSchema);
