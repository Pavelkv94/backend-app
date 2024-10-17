import { NextFunction, Request, Response } from "express";
import { postsRepository } from "../posts.repository";

export const findPostMiddleware = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const isPostExist = await postsRepository.findPost(req.params.id);

  if (!isPostExist) {
    res.sendStatus(404);
    return;
  }

  next();
};
