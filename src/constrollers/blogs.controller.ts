import { Request, Response } from "express";
import { BlogInputModel, BlogInputQueryModel, BlogViewModel, URIParamsBlogModel } from "../input-output-types/blogs-types";
import { OutputErrorsType } from "../input-output-types/output-errors-types";
import { blogsService } from "../services/blogs.service";
import { SortDirection, WithId } from "mongodb";
import { BlogDbType } from "../db/blog-db-type";
import { OutputDataWithPagination } from "../input-output-types/common-types";

export const blogsController = {
  async getBlogs(req: Request<{}, {}, {}, BlogInputQueryModel>, res: Response<OutputDataWithPagination<BlogViewModel>>) {
    //query уже установлены по дефолу при отсуствии в middleware
    const queryData = {
      pageNumber: +req.query.pageNumber,
      pageSize: +req.query.pageSize,
      sortBy: req.query.sortBy,
      sortDirection: req.query.sortDirection as SortDirection,
      searchNameTerm: req.query.searchNameTerm,
    };

    const blogs = await blogsService.findAll(queryData);
    res.status(200).json(blogs);
  },

  async getBlog(req: Request<URIParamsBlogModel>, res: Response<BlogViewModel>) {
    const blog = await blogsService.find(req.params.id);
    if (!blog) {
      res.sendStatus(404);
    } else {
      res.status(200).json(blog);
    }
  },

  async createBlog(req: Request<any, any, BlogInputModel>, res: Response<WithId<BlogDbType> | null>) {
    const newBlog = await blogsService.create(req.body);
    res.status(201).json(newBlog);
  },

  async updateBlog(req: Request<any, any, BlogInputModel>, res: Response<BlogViewModel>) {
    const isUpdated = await blogsService.update(req.params.id, req.body);

    if (!isUpdated) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  },
  async deleteBlog(req: Request<URIParamsBlogModel>, res: Response<OutputErrorsType>) {
    const isDeletedBlog = await blogsService.delete(req.params.id);

    if (!isDeletedBlog) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  },
};
