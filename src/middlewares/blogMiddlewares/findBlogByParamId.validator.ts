import { NextFunction, Request, Response } from "express";
import { blogsRepository } from "../../repositories/blogs.repository";

export const findBlogByParamIdValidator = async (req: Request, res: Response, next: NextFunction) => {
  const isBlogExist = await blogsRepository.find(req.params.id);

  if (!isBlogExist) {
    res.sendStatus(404);
    return;
  }
  next();
};
