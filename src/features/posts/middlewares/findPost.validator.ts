import { NextFunction, Request, Response } from "express";
import { postsRepository } from "../posts.repository";

export const findPostValidator = (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const isPostExist = postsRepository.findPost(req.params.id);
  if (!isPostExist) {
    res.sendStatus(404);
    return;
  }
  next();
};
