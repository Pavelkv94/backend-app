import { Request, Response } from "express";
import { OutputErrorsType } from "../../types/output-errors-types";
import { PostInputModel, PostInputQueryModel, PostViewModel, URIParamsPostModel } from "./models/posts.models";
import { postsService } from "./posts.service";
import { OutputDataWithPagination } from "../../types/common-types";
import { SortDirection } from "mongodb";
import { postsQueryRepository } from "./posts.query-repository";
import { CommentInputModel, CommentInputQueryModel, CommentViewModel } from "../comments/models/comments.models";
import { commentsService } from "../comments/comments.service";
import { usersQueryRepository } from "../users/users.query-repository";
import { commentQueryRepository } from "../comments/comments.query-repository";
import { IdType } from "../auth/models/auth.models";

export const postsController = {
  async getPosts(req: Request<{}, {}, {}, PostInputQueryModel>, res: Response<OutputDataWithPagination<PostViewModel>>) {
    const queryData = {
      pageNumber: +req.query.pageNumber,
      pageSize: +req.query.pageSize,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection as SortDirection,
    };

    const posts = await postsQueryRepository.findAllPosts(queryData);

    res.status(200).json(posts);
  },

  async getPost(req: Request<URIParamsPostModel>, res: Response<PostViewModel>) {
    const post = await postsQueryRepository.findPost(req.params.id);

    if (!post) {
      res.sendStatus(404);
    } else {
      res.status(200).json(post);
    }
  },

  async createPost(req: Request<any, any, PostInputModel>, res: Response<PostViewModel | OutputErrorsType>) {
    const newPostId = await postsService.createPost(req.body);
    const newPost = await postsQueryRepository.findPost(newPostId);

    if (!newPost) {
      res.status(500).json({ errorsMessages: [{ message: "Something was wrong", field: "" }] });
      return;
    }

    res.status(201).json(newPost);
  },

  async updatePost(req: Request<URIParamsPostModel, {}, PostInputModel>, res: Response) {
    const isUpdatedPost = await postsService.updatePost(req.params.id, req.body);

    if (!isUpdatedPost) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  },
  async deletePost(req: Request<URIParamsPostModel>, res: Response) {
    const isDeletedPost = await postsService.deletePost(req.params.id);

    if (!isDeletedPost) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  },

  //POST COMMENTS
  async getComments(req: Request<URIParamsPostModel, {}, {}, CommentInputQueryModel>, res: Response<OutputDataWithPagination<CommentViewModel>>) {
    const queryData = {
      pageNumber: +req.query.pageNumber,
      pageSize: +req.query.pageSize,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection as SortDirection,
    };

    const comments = await commentQueryRepository.findAllComments(req.params.id, queryData);

    res.status(200).json(comments);
  },
  async createComment(req: Request<URIParamsPostModel, {}, CommentInputModel, {}, IdType>, res: Response<CommentViewModel | OutputErrorsType>) {
    const user = await usersQueryRepository.findMe(req.user.id);

    if (!user) {
      res.status(500).json({ errorsMessages: [{ message: "Something was wrong", field: "" }] });
      return;
    }

    const newCommentId = await commentsService.createComment(req.params.id, req.body, user);
    const newComment = await commentQueryRepository.findComment(newCommentId);

    if (!user || !newComment) {
      res.status(500).json({ errorsMessages: [{ message: "Something was wrong", field: "" }] });
      return;
    }

    res.status(201).send(newComment);
  },
};
