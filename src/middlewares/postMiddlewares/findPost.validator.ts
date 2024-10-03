import { NextFunction, Request, Response } from "express";
import { postsRepository } from "../../repositories/posts.repository";

export const findPostValidator = (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const isPostExist = postsRepository.find(req.params.id);
  if (!isPostExist) {
    res.sendStatus(404);
    return;
  }
  next();
};
