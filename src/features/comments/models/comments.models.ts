import { SortDirection } from "mongodb";
import { HydratedDocument } from "mongoose";
import { LikeInfoType } from "../../likes/models/like.model";

export type CommentInputModel = {
  content: string;
};

export type CommentEntityModel = {
  content: string;
  postId: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: LikeInfoType;
};

export type CommentViewModel = Omit<CommentEntityModel, "postId"> & {
  id: string;
};

export type CommentInputQueryModel = {
  sortBy: string;
  sortDirection: string;
  pageNumber: string;
  pageSize: string;
};

export type CommentValidQueryModel = {
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};

export type URIParamsCommentModel = {
  id: string;
};

export type CommentDocument = HydratedDocument<CommentEntityModel>;
