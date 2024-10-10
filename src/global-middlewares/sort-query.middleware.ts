import { NextFunction, Request, Response } from "express";
import { query } from "express-validator";

const sortDirectionValidator = query("sortDirection").custom(async (sortDirection) => {
  const allowedValues = [1, -1, "asc", "desc", "ascending", "descending"];
  if (!allowedValues.includes(sortDirection)) {
    throw new Error("Invalid value");
  }
  return true;
});

const sortQueryCheck = (req: Request, res: Response, next: NextFunction) => {
  req.query.sortBy = req.query.sortBy || "createdAt";
  req.query.sortDirection = req.query.sortDirection || "desc";

  next();
};

export const sortQueryMiddleware = [sortQueryCheck, sortDirectionValidator];
