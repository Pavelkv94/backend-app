import { NextFunction, Request, Response } from "express";
import { PostInputModel, PostInputQueryModel, PostViewModel, URIParamsPostModel } from "./models/posts.models";
import { PostService, postService } from "./posts.service";
import { HTTP_STATUSES, OutputDataWithPagination } from "../../types/common-types";
import { SortDirection } from "mongodb";
import { PostQueryRepository, postQueryRepository } from "./repositories/posts.query-repository";
import { CommentInputModel, CommentInputQueryModel, CommentViewModel } from "../comments/models/comments.models";
import { IdType } from "../auth/models/auth.models";
import { ApiError } from "../../exeptions/api-error";
import { userQueryRepository, UserQueryRepository } from "../users/repositories/users.query-repository";
import { commentQueryRepository, CommentQueryRepository } from "../comments/repositories/comments.query-repository";
import { commentService, CommentService } from "../comments/comments.service";

export class PostController {
  constructor(
    public postQueryRepository: PostQueryRepository,
    public postService: PostService,
    public commentQueryRepository: CommentQueryRepository,
    public commentService: CommentService,
    public userQueryRepository: UserQueryRepository
  ) {}

  async getPosts(req: Request<{}, {}, {}, PostInputQueryModel>, res: Response<OutputDataWithPagination<PostViewModel>>, next: NextFunction) {
    try {
      const queryData = {
        pageNumber: +req.query.pageNumber,
        pageSize: +req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection as SortDirection,
      };

      const posts = await this.postQueryRepository.findAllPosts(queryData);

      res.status(HTTP_STATUSES.SUCCESS).json(posts);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

  async getPost(req: Request<URIParamsPostModel>, res: Response<PostViewModel>, next: NextFunction) {
    try {
      const post = await this.postQueryRepository.findPost(req.params.id);

      if (!post) {
        return next(ApiError.NotFound("The requested resource was not found"));
      } else {
        res.status(HTTP_STATUSES.SUCCESS).json(post);
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

  async createPost(req: Request<any, any, PostInputModel>, res: Response<PostViewModel>, next: NextFunction) {
    try {
      const newPostId = await this.postService.createPost(req.body);
      const newPost = await this.postQueryRepository.findPost(newPostId);

      if (!newPost) {
        return next(ApiError.NotFound("The requested post was not found"));
      }

      res.status(201).json(newPost);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

  async updatePost(req: Request<URIParamsPostModel, {}, PostInputModel>, res: Response, next: NextFunction) {
    try {
      const updatedPostId = await this.postService.updatePost(req.params.id, req.body);

      if (!updatedPostId) {
        return next(ApiError.NotFound("The requested resource was not found"));
      } else {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT);
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
  async deletePost(req: Request<URIParamsPostModel>, res: Response, next: NextFunction) {
    try {
      const isDeletedPost = await this.postService.deletePost(req.params.id);

      if (!isDeletedPost) {
        return next(ApiError.NotFound("The requested resource was not found"));
      } else {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT);
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

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

      const comments = await this.commentQueryRepository.findAllComments(req.params.id, queryData);

      res.status(HTTP_STATUSES.SUCCESS).json(comments);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
  async createComment(req: Request<URIParamsPostModel, {}, CommentInputModel, {}, IdType>, res: Response<CommentViewModel>, next: NextFunction) {
    try {
      const user = await this.userQueryRepository.findMe(req.user.id);

      if (!user) {
        return next(ApiError.NotFound("The requested user was not found"));
      }

      const newCommentId = await this.commentService.createComment(req.params.id, req.body, user);
      const newComment = await this.commentQueryRepository.findComment(newCommentId);

      if (!newComment) {
        return next(ApiError.NotFound("The requested comment was not found"));
      }

      res.status(201).send(newComment);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
}

export const postController = new PostController(postQueryRepository, postService, commentQueryRepository, commentService, userQueryRepository);
