import { Request, Response } from "express";
import { OutputErrorsType } from "../input-output-types/output-errors-types";
import { PostInputModel, PostInputQueryModel, PostViewModel, URIParamsPostModel } from "../input-output-types/posts-types";
import { postsService } from "../services/posts.service";
import { OutputDataWithPagination } from "../input-output-types/common-types";
import { SortDirection } from "mongodb";

export const postsController = {
  async getPosts(req: Request<{}, {}, {}, PostInputQueryModel>, res: Response<OutputDataWithPagination<PostViewModel>>) {
    const queryData = {
      pageNumber: +req.query.pageNumber,
      pageSize: +req.query.pageSize,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection as SortDirection,
    };

    const posts = await postsService.findPosts(queryData);

    res.status(200).json(posts);
  },

  async getPost(req: Request<URIParamsPostModel>, res: Response<PostViewModel>) {
    const post = await postsService.find(req.params.id);

    if (!post) {
      res.sendStatus(404);
    } else {
      res.status(200).json(post);
    }
  },

  async createPost(req: Request<any, any, PostInputModel>, res: Response<PostViewModel | OutputErrorsType>) {
    const newPost = await postsService.create(req.body);

    res.status(201).json(newPost!);
  },

  async updatePost(req: Request<URIParamsPostModel, {}, PostInputModel>, res: Response<OutputErrorsType>) {
    const isUpdatedPost = await postsService.update(req.params.id, req.body);

    if (!isUpdatedPost) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  },
  async deletePost(req: Request<URIParamsPostModel>, res: Response) {
    const isDeletedPost = await postsService.delete(req.params.id);

    if (!isDeletedPost) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  },
};
