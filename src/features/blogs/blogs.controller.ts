import { NextFunction, Request, Response } from "express";
import { BlogInputModel, BlogInputQueryModel, BlogViewModel, URIParamsBlogModel } from "./models/blogs.models";
import { BlogService } from "./blogs.service";
import { SortDirection } from "mongodb";
import { HTTP_STATUSES, OutputDataWithPagination } from "../../types/common-types";
import { PostForBlogInputModel, PostInputQueryModel, PostViewModel } from "../posts/models/posts.models";
import { BlogQueryRepository } from "./repositories/blogs.query-repository";
import { ApiError } from "../../exeptions/api-error";
import { PostService } from "../posts/posts.service";
import { PostQueryRepository } from "../posts/repositories/posts.query-repository";
import { JwtService } from "../../adapters/jwt/jwt.service";
import { injectable } from "inversify";

@injectable()
export class BlogController {
  constructor(
    public blogService: BlogService,
    public blogQueryRepository: BlogQueryRepository,
    public postService: PostService,
    public postQueryRepository: PostQueryRepository,
    public jwtService: JwtService
  ) {}

  async getBlogs(req: Request<{}, {}, {}, BlogInputQueryModel>, res: Response<OutputDataWithPagination<BlogViewModel>>, next: NextFunction) {
    try {
      const queryData = {
        pageNumber: +req.query.pageNumber,
        pageSize: +req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection as SortDirection,
        searchNameTerm: req.query.searchNameTerm,
      };

      const blogs = await this.blogQueryRepository.findAllBlogs(queryData);
      res.status(HTTP_STATUSES.SUCCESS).json(blogs);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

  async getBlog(req: Request<URIParamsBlogModel>, res: Response<BlogViewModel>, next: NextFunction) {
    try {
      const blog = await this.blogQueryRepository.findBlog(req.params.id);
      if (!blog) {
        return next(ApiError.NotFound("The blog resource was not found"));
      } else {
        res.status(HTTP_STATUSES.SUCCESS).json(blog);
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

  async createBlog(req: Request<any, any, BlogInputModel>, res: Response<BlogViewModel>, next: NextFunction) {
    try {
      const newBlogId = await this.blogService.createBlog(req.body);

      const newBlog = await this.blogQueryRepository.findBlog(newBlogId);

      if (!newBlog) {
        return next(ApiError.NotFound("The requested blog was not found"));
      }

      res.status(201).json(newBlog);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

  async updateBlog(req: Request<any, any, BlogInputModel>, res: Response<BlogViewModel>, next: NextFunction) {
    try {
      const updatedBlogId = await this.blogService.updateBlog(req.params.id, req.body);

      if (!updatedBlogId) {
        return next(ApiError.NotFound("The requested resource was not found"));
      } else {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT);
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
  async deleteBlog(req: Request<URIParamsBlogModel>, res: Response, next: NextFunction) {
    try {
      const isDeletedBlog = await this.blogService.deleteBlog(req.params.id);

      if (!isDeletedBlog) {
        return next(ApiError.NotFound("The requested resource was not found"));
      } else {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT);
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

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

      let userId = null;

      if (req.headers.authorization) {
        const [authType, token] = req.headers.authorization.split(" ");
        if (authType === "Bearer") {
          const payload = await this.jwtService.verifyAccessToken(token);
          if (payload) {
            userId = payload.user_id;
          }
        }
      }

      const blog = await this.blogQueryRepository.findBlog(req.params.id);
      const posts = await this.postQueryRepository.findAllPosts(queryData, userId, blog!.id);

      res.status(HTTP_STATUSES.SUCCESS).json(posts);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }

  async createBlogPost(req: Request<URIParamsBlogModel, {}, PostForBlogInputModel>, res: Response<PostViewModel>, next: NextFunction) {
    try {
      const newPostId = await this.postService.createForBlog(req.body, req.params.id);
      if (!newPostId) {
        return next(ApiError.NotFound("The requested new post was not found"));
      }

      let userId = null;

      if (req.headers.authorization) {
        const [authType, token] = req.headers.authorization.split(" ");
        if (authType === "Bearer") {
          const payload = await this.jwtService.verifyAccessToken(token);
          if (payload) {
            userId = payload.user_id;
          }
        }
      }

      const newPost = await this.postQueryRepository.findPost(newPostId, userId);
      if (!newPost) {
        return next(ApiError.NotFound("The requested new post was not found"));
      }

      res.status(201).json(newPost);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
}
