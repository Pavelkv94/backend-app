import { NextFunction, Request, Response } from "express";
import { commentQueryRepository } from "../comments.query-repository";


export const findCommentByIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const isCommentExist = await commentQueryRepository.findComment(req.params.id);

  if (!isCommentExist) {
    res.sendStatus(404);
    return;
  }
  next();
};
