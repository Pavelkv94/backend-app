import { Request, Response } from "express";
import { BlogEntityModel, BlogInputModel, BlogInputQueryModel, BlogViewModel, URIParamsBlogModel } from "./models/blogs.models";
import { OutputErrorsType } from "../../types/output-errors-types";
import { blogsService } from "./blogs.service";
import { SortDirection, WithId } from "mongodb";
import { OutputDataWithPagination } from "../../types/common-types";
import { PostForBlogInputModel, PostInputQueryModel, PostViewModel } from "../posts/models/posts.models";
import { postsService } from "../posts/posts.service";
import { blogsQueryRepository } from "./blogs.query-repository";
import { postsQueryRepository } from "../posts/posts.query-repository";
import { handleUnexpectedError } from "../../exeptions/unexpectedError";

export const blogsController = {
  async getBlogs(req: Request<{}, {}, {}, BlogInputQueryModel>, res: Response<OutputDataWithPagination<BlogViewModel> | OutputErrorsType>) {
    try {
      const queryData = {
        pageNumber: +req.query.pageNumber,
        pageSize: +req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection as SortDirection,
        searchNameTerm: req.query.searchNameTerm,
      };

      const blogs = await blogsQueryRepository.findAllBlogs(queryData);
      res.status(200).json(blogs);
    } catch (error) {
      handleUnexpectedError(res, error as Error);
    }
  },

  async getBlog(req: Request<URIParamsBlogModel>, res: Response<BlogViewModel | OutputErrorsType>) {
    try {
      const blog = await blogsQueryRepository.findBlog(req.params.id);
      if (!blog) {
        res.sendStatus(404);
      } else {
        res.status(200).json(blog);
      }
    } catch (error) {
      handleUnexpectedError(res, error as Error);
    }
  },

  async createBlog(req: Request<any, any, BlogInputModel>, res: Response<BlogViewModel | OutputErrorsType>) {
    try {
      const newBlogId = await blogsService.createBlog(req.body);
      const newBlog = await blogsQueryRepository.findBlog(newBlogId);

      if (!newBlog) {
        throw new Error("blog not found");
      }

      res.status(201).json(newBlog);
    } catch (error) {
      handleUnexpectedError(res, error as Error);
    }
  },

  async updateBlog(req: Request<any, any, BlogInputModel>, res: Response<BlogViewModel | OutputErrorsType>) {
    try {
      const isUpdated = await blogsService.updateBlog(req.params.id, req.body);

      if (!isUpdated) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    } catch (error) {
      handleUnexpectedError(res, error as Error);
    }
  },
  async deleteBlog(req: Request<URIParamsBlogModel>, res: Response<OutputErrorsType>) {
    try {
      const isDeletedBlog = await blogsService.deleteBlog(req.params.id);

      if (!isDeletedBlog) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    } catch (error) {
      handleUnexpectedError(res, error as Error);
    }
  },

  async getBlogPosts(req: Request<URIParamsBlogModel, {}, {}, PostInputQueryModel>, res: Response<OutputDataWithPagination<PostViewModel> | OutputErrorsType>) {
    try {
      const queryData = {
        pageNumber: +req.query.pageNumber,
        pageSize: +req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection as SortDirection,
      };
      const blog = await blogsQueryRepository.findBlog(req.params.id);
      const posts = await postsQueryRepository.findAllPosts(queryData, blog!.id);

      res.status(200).json(posts);
    } catch (error) {
      handleUnexpectedError(res, error as Error);
    }
  },

  async createBlogPost(req: Request<URIParamsBlogModel, {}, PostForBlogInputModel>, res: Response<PostViewModel | OutputErrorsType>) {
    try {
      const newPost = await postsService.createForBlog(req.body, req.params.id);

      res.status(201).json(newPost!);
    } catch (error) {
      handleUnexpectedError(res, error as Error);
    }
  },
};
