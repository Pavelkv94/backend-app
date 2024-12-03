import { SortDirection } from "mongodb";
import { HydratedDocument } from "mongoose";
import { ExtendedLikeInfoType, NewestLikeType } from "../../likes/models/like.model";

export type PostEntityModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikeInfoType;
};

export type PostViewModel = {
  id: string;
} & PostEntityModel;

export type PostInputModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type PostForBlogInputModel = {
  title: string;
  shortDescription: string;
  content: string;
};

export type PostOutputModel = PostViewModel;

export type URIParamsPostModel = {
  id: string;
};

export type PostInputQueryModel = {
  sortBy: string;
  sortDirection: string;
  pageNumber: string;
  pageSize: string;
};

export type PostValidQueryModel = {
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};

export type PostDocument = HydratedDocument<PostEntityModel>;
