import { SortDirection } from "mongodb";

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
