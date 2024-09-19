import { Request, Response } from "express";
import { OutputErrorsType } from "../../input-output-types/output-errors-types";
import { postsRepository } from "./posts.repository";
import { PostInputModel, PostViewModel, URIParamsPostModel } from "../../input-output-types/posts-types";

export const postsController = {
  async getPosts(req: Request, res: Response<PostViewModel[]>) {
    const posts = await postsRepository.findPosts();

    res.status(200).json(posts);
  },

  async getPost(req: Request<URIParamsPostModel>, res: Response<PostViewModel>) {
    const post = await postsRepository.findForOutput(req.params.id);

    if (!post) {
      res.sendStatus(404);
    } else {
      res.status(200).json(post);
    }
  },

  async createPost(req: Request<any, any, PostInputModel>, res: Response<PostViewModel | OutputErrorsType>) {
    const newPostId = await postsRepository.create(req.body);
    const newPost = await postsRepository.findAndMap(newPostId.id);

    if (!newPost) {
      res.sendStatus(500);
    } else {
      res.status(201).json(newPost);
    }
  },

  async updatePost(req: Request<URIParamsPostModel, {}, PostInputModel>, res: Response<OutputErrorsType>) {
    const isUpdatedPost = await postsRepository.update(req.params.id, req.body);

    if (!isUpdatedPost) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  },
  async deletePost(req: Request<URIParamsPostModel>, res: Response) {
    const isDeletedPost = await postsRepository.delete(req.params.id);

    if (!isDeletedPost) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  },
};
