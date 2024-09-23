import { Request, Response } from "express";
import { BlogInputModel, BlogViewModel, URIParamsBlogModel } from "../input-output-types/blogs-types";
import { blogsRepository } from "../repositories/blogs.repository";
import { OutputErrorsType } from "../input-output-types/output-errors-types";

export const blogsController = {
  async getBlogs(req: Request, res: Response<BlogViewModel[]>) {
    const blogs = await blogsRepository.findAll();
    res.status(200).json(blogs);
  },
  async getBlog(req: Request<URIParamsBlogModel>, res: Response<BlogViewModel>) {
    const blog = await blogsRepository.find(req.params.id);
    if (!blog) {
      res.sendStatus(404);
    } else {
      res.status(200).json(blog);
    }
  },
  async createBlog(req: Request<any, any, BlogInputModel>, res: Response<BlogViewModel>) {
    const newBlogId = await blogsRepository.create(req.body);
    const newBlog = await blogsRepository.findAndMap(newBlogId);

    res.status(201).json(newBlog);
  },
  async updateBlog(req: Request<any, any, BlogInputModel>, res: Response<BlogViewModel>) {
    const isUpdated = await blogsRepository.update(req.params.id, req.body);

    if (!isUpdated) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  },
  async deleteBlog(req: Request<URIParamsBlogModel>, res: Response<OutputErrorsType>) {
    const isDeletedPBlog = await blogsRepository.delete(req.params.id);

    if (!isDeletedPBlog) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  },
};
