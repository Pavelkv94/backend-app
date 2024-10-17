import { NextFunction, Request, Response } from "express";

export const blogQueryMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.query.searchNameTerm = req.query.searchNameTerm || "";

  next();
};
