import { HydratedDocument } from "mongoose";

export type LikeStatusType = "None" | "Like" | "Dislike";

export type NewestLikeType = {
  addedAt: string;
  userId: string;
  login: string;
};

export type ExtendedLikeInfoType = {
  likesCount: number;
  dislikesCount: number;
  newestLikes: NewestLikeType[];
};

export type LikeInfoType = {
  likesCount: number;
  dislikesCount: number;
};

export type LikeEntityModel = {
  user_id: string;
  user_login: string;
  parent_id: string;
  status: LikeStatusType;
  updatedAt: string;
};

export type LikeDocument = HydratedDocument<LikeEntityModel>;

export type LikeInputModel = {
  likeStatus: LikeStatusType;
};
