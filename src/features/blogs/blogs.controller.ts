import { NextFunction, Request, Response } from "express";
import { BlogEntityModel, BlogInputModel, BlogInputQueryModel, BlogViewModel, URIParamsBlogModel } from "./models/blogs.models";
import { blogsService } from "./blogs.service";
import { SortDirection, WithId } from "mongodb";
import { HTTP_STATUSES, OutputDataWithPagination } from "../../types/common-types";
import { PostForBlogInputModel, PostInputQueryModel, PostViewModel } from "../posts/models/posts.models";
import { postsService } from "../posts/posts.service";
import { blogsQueryRepository } from "./blogs.query-repository";
import { postsQueryRepository } from "../posts/posts.query-repository";
import { ApiError } from "../../exeptions/api-error";

export const blogsController = {
  async getBlogs(req: Request<{}, {}, {}, BlogInputQueryModel>, res: Response<OutputDataWithPagination<BlogViewModel>>, next: NextFunction) {
    try {
      const queryData = {
        pageNumber: +req.query.pageNumber,
        pageSize: +req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection as SortDirection,
        searchNameTerm: req.query.searchNameTerm,
      };

      const blogs = await blogsQueryRepository.findAllBlogs(queryData);
      res.status(HTTP_STATUSES.SUCCESS).json(blogs);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },

  async getBlog(req: Request<URIParamsBlogModel>, res: Response<BlogViewModel>, next: NextFunction) {
    try {
      const blog = await blogsQueryRepository.findBlog(req.params.id);
      if (!blog) {
        return next(ApiError.NotFound("The blog resource was not found"));
      } else {
        res.status(HTTP_STATUSES.SUCCESS).json(blog);
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },

  async createBlog(req: Request<any, any, BlogInputModel>, res: Response<BlogViewModel>, next: NextFunction) {
    try {
      const newBlogId = await blogsService.createBlog(req.body);
      const newBlog = await blogsQueryRepository.findBlog(newBlogId);

      if (!newBlog) {
        return next(ApiError.NotFound("The requested blog was not found"));
      }

      res.status(201).json(newBlog);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },

  async updateBlog(req: Request<any, any, BlogInputModel>, res: Response<BlogViewModel>, next: NextFunction) {
    try {
      const isUpdated = await blogsService.updateBlog(req.params.id, req.body);

      if (!isUpdated) {
        return next(ApiError.NotFound("The requested resource was not found"));
      } else {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT);
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async deleteBlog(req: Request<URIParamsBlogModel>, res: Response, next: NextFunction) {
    try {
      const isDeletedBlog = await blogsService.deleteBlog(req.params.id);

      if (!isDeletedBlog) {
        return next(ApiError.NotFound("The requested resource was not found"));
      } else {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT);
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },

  async getBlogPosts(
    req: Request<URIParamsBlogModel, {}, {}, PostInputQueryModel>,
    res: Response<OutputDataWithPagination<PostViewModel>>,
    next: NextFunction
  ) {
    try {
      const queryData = {
        pageNumber: +req.query.pageNumber,
        pageSize: +req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection as SortDirection,
      };
      const blog = await blogsQueryRepository.findBlog(req.params.id);
      const posts = await postsQueryRepository.findAllPosts(queryData, blog!.id);

      res.status(HTTP_STATUSES.SUCCESS).json(posts);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },

  async createBlogPost(req: Request<URIParamsBlogModel, {}, PostForBlogInputModel>, res: Response<PostViewModel>, next: NextFunction) {
    try {
      const newPost = await postsService.createForBlog(req.body, req.params.id);

      if (!newPost) {
        return next(ApiError.NotFound("The requested new post was not found"));
      } else {
        res.status(201).json(newPost);
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
};
