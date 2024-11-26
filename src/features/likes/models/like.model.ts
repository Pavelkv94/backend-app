import { HydratedDocument } from "mongoose";

export type LikeStatusType = "None" | "Like" | "Dislike";

export type LikeInfoType = {
  likesCount: number;
  dislikesCount: number;
};

export type LikeEntityModel = {
  user_id: string;
  parent_id: string;
  status: LikeStatusType;
  updatedAt: string;
};

export type LikeDocument = HydratedDocument<LikeEntityModel>;

export type LikeInputModel = {
  likeStatus: LikeStatusType;
};
