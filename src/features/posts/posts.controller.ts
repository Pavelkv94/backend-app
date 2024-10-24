import { NextFunction, Request, Response } from "express";
import { PostInputModel, PostInputQueryModel, PostViewModel, URIParamsPostModel } from "./models/posts.models";
import { postsService } from "./posts.service";
import { HTTP_STATUSES, OutputDataWithPagination } from "../../types/common-types";
import { SortDirection } from "mongodb";
import { postsQueryRepository } from "./posts.query-repository";
import { CommentInputModel, CommentInputQueryModel, CommentViewModel } from "../comments/models/comments.models";
import { commentsService } from "../comments/comments.service";
import { usersQueryRepository } from "../users/users.query-repository";
import { commentQueryRepository } from "../comments/comments.query-repository";
import { IdType } from "../auth/models/auth.models";
import { ApiError } from "../../exeptions/api-error";

export const postsController = {
  async getPosts(req: Request<{}, {}, {}, PostInputQueryModel>, res: Response<OutputDataWithPagination<PostViewModel>>, next: NextFunction) {
    try {
      const queryData = {
        pageNumber: +req.query.pageNumber,
        pageSize: +req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection as SortDirection,
      };

      const posts = await postsQueryRepository.findAllPosts(queryData);

      res.status(HTTP_STATUSES.SUCCESS).json(posts);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },

  async getPost(req: Request<URIParamsPostModel>, res: Response<PostViewModel>, next: NextFunction) {
    try {
      const post = await postsQueryRepository.findPost(req.params.id);

      if (!post) {
        return next(ApiError.NotFound("The requested resource was not found"));
      } else {
        res.status(HTTP_STATUSES.SUCCESS).json(post);
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },

  async createPost(req: Request<any, any, PostInputModel>, res: Response<PostViewModel>, next: NextFunction) {
    try {
      const newPostId = await postsService.createPost(req.body);
      const newPost = await postsQueryRepository.findPost(newPostId);

      if (!newPost) {
        return next(ApiError.NotFound("The requested post was not found"));
      }

      res.status(201).json(newPost);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },

  async updatePost(req: Request<URIParamsPostModel, {}, PostInputModel>, res: Response, next: NextFunction) {
    try {
      const isUpdatedPost = await postsService.updatePost(req.params.id, req.body);

      if (!isUpdatedPost) {
        return next(ApiError.NotFound("The requested resource was not found"));
      } else {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT);
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async deletePost(req: Request<URIParamsPostModel>, res: Response, next: NextFunction) {
    try {
      const isDeletedPost = await postsService.deletePost(req.params.id);

      if (!isDeletedPost) {
        return next(ApiError.NotFound("The requested resource was not found"));
      } else {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT);
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },

  //POST COMMENTS
  async getComments(
    req: Request<URIParamsPostModel, {}, {}, CommentInputQueryModel>,
    res: Response<OutputDataWithPagination<CommentViewModel>>,
    next: NextFunction
  ) {
    try {
      const queryData = {
        pageNumber: +req.query.pageNumber,
        pageSize: +req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection as SortDirection,
      };

      const comments = await commentQueryRepository.findAllComments(req.params.id, queryData);

      res.status(HTTP_STATUSES.SUCCESS).json(comments);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async createComment(
    req: Request<URIParamsPostModel, {}, CommentInputModel, {}, IdType>,
    res: Response<CommentViewModel>,
    next: NextFunction
  ) {
    try {
      const user = await usersQueryRepository.findMe(req.user.id);

      if (!user) {
        return next(ApiError.NotFound("The requested user was not found"));
      }

      const newCommentId = await commentsService.createComment(req.params.id, req.body, user);
      const newComment = await commentQueryRepository.findComment(newCommentId);

      if (!newComment) {
        return next(ApiError.NotFound("The requested comment was not found"));
      }

      res.status(201).send(newComment);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
};
