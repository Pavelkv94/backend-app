import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../../exeptions/api-error";
import { blogQueryRepository } from "../repositories/blogs.query-repository";

export const findBlogByParamIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const isBlogExist = await blogQueryRepository.findBlog(req.params.id);

  if (!isBlogExist) {
    return next(ApiError.NotFound("The requested resource was not found"));
  }
  next();
};
