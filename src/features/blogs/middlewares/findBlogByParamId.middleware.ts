import { NextFunction, Request, Response } from "express";
import { blogsQueryRepository } from "../blogs.query-repository";

export const findBlogByParamIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const isBlogExist = await blogsQueryRepository.findBlog(req.params.id);

  if (!isBlogExist) {
    res.sendStatus(404);
    return;
  }
  next();
};
