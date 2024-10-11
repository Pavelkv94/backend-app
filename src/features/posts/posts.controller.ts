import { Request, Response } from "express";
import { OutputErrorsType } from "../../input-output-types/output-errors-types";
import { PostInputModel, PostInputQueryModel, PostViewModel, URIParamsPostModel } from "../../input-output-types/posts-types";
import { postsService } from "./posts.service";
import { OutputDataWithPagination } from "../../input-output-types/common-types";
import { SortDirection } from "mongodb";
import { postsQueryRepository } from "./posts.query-repository";

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
      res.status(404).json({ errorsMessages: [{ message: "Post not found", field: "" }] });
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
};
