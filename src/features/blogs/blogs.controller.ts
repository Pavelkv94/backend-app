import { Request, Response } from "express";
import { BlogEntityModel, BlogInputModel, BlogInputQueryModel, BlogViewModel, URIParamsBlogModel } from "../../input-output-types/blogs-types";
import { OutputErrorsType } from "../../input-output-types/output-errors-types";
import { blogsService } from "./blogs.service";
import { SortDirection, WithId } from "mongodb";
import { OutputDataWithPagination } from "../../input-output-types/common-types";
import { PostForBlogInputModel, PostInputQueryModel, PostViewModel } from "../../input-output-types/posts-types";
import { postsService } from "../posts/posts.service";
import { blogsQueryRepository } from "./blogs.query-repository";
import { postsQueryRepository } from "../posts/posts.query-repository";

export const blogsController = {
  async getBlogs(req: Request<{}, {}, {}, BlogInputQueryModel>, res: Response<OutputDataWithPagination<BlogViewModel>>) {
    //query уже установлены по дефолtу  в middleware при отсуствии
    const queryData = {
      pageNumber: +req.query.pageNumber,
      pageSize: +req.query.pageSize,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection as SortDirection,
      searchNameTerm: req.query.searchNameTerm,
    };

    const blogs = await blogsQueryRepository.findAllBlogs(queryData);
    res.status(200).json(blogs);
  },

  async getBlog(req: Request<URIParamsBlogModel>, res: Response<BlogViewModel>) {
    const blog = await blogsQueryRepository.findBlog(req.params.id);
    if (!blog) {
      res.sendStatus(404);
    } else {
      res.status(200).json(blog);
    }
  },

  async createBlog(req: Request<any, any, BlogInputModel>, res: Response<BlogViewModel | null>) {
    const newBlogId = await blogsService.createBlog(req.body);
    const newBlog = await blogsQueryRepository.findBlog(newBlogId);

    if (!newBlog) {
      //@ts-ignore
      res.status(501).json({message: req.body}); //! уточнить ошибку
      return;
    }
    res.status(201).json(newBlog);
  },

  async updateBlog(req: Request<any, any, BlogInputModel>, res: Response<BlogViewModel>) {
    const isUpdated = await blogsService.updateBlog(req.params.id, req.body);

    if (!isUpdated) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  },
  async deleteBlog(req: Request<URIParamsBlogModel>, res: Response<OutputErrorsType>) {
    const isDeletedBlog = await blogsService.deleteBlog(req.params.id);

    if (!isDeletedBlog) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  },

  async getBlogPosts(req: Request<URIParamsBlogModel, {}, {}, PostInputQueryModel>, res: Response<OutputDataWithPagination<PostViewModel> | OutputErrorsType>) {
    const queryData = {
      pageNumber: +req.query.pageNumber,
      pageSize: +req.query.pageSize,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection as SortDirection,
    };
    const blog = await blogsQueryRepository.findBlog(req.params.id);
    const posts = await postsQueryRepository.findAllPosts(queryData, blog!.id);

    res.status(200).json(posts);
  },

  async createBlogPost(req: Request<URIParamsBlogModel, {}, PostForBlogInputModel>, res: Response<PostViewModel | OutputErrorsType>) {
    const newPost = await postsService.createForBlog(req.body, req.params.id);

    res.status(201).json(newPost!);
  },
};
