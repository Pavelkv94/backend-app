import { NextFunction, Request, Response } from "express";
import { blogsQueryRepository } from "../repositories/blogs.query-repository";
import { ApiError } from "../../../exeptions/api-error";

export const findBlogByParamIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const isBlogExist = await blogsQueryRepository.findBlog(req.params.id);

  if (!isBlogExist) {
    return next(ApiError.NotFound("The requested resource was not found"));
  }
  next();
};
