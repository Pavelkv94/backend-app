import { NextFunction, Request, Response } from "express";

export const usersQueryMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.query.searchLoginTerm = req.query.searchLoginTerm || "";
  req.query.searchEmailTerm = req.query.searchEmailTerm || "";

  next();
};
