import { NextFunction, Request, Response } from "express";
import { query } from "express-validator";

const pageNumberValidator = query("pageNumber").custom(async (pageNumber) => {
  if (isNaN(Number(pageNumber))) {
    throw new Error("Should be a number");
  }
  if (Number(pageNumber) < 1) {
    throw new Error("Should be start from 1");
  }
  return true;
});

const pageSizeValidator = query("pageSize").custom(async (pageSize) => {
  if (isNaN(Number(pageSize))) {
    throw new Error("Should be a number");
  }
  if (Number(pageSize) < 1) {
    throw new Error("Should be start from 1");
  }
  return true;
});

const paginationQueryCheck = (req: Request, res: Response, next: NextFunction) => {
  req.query.pageNumber = req.query.pageNumber || "1";
  req.query.pageSize = req.query.pageSize || "10";

  next();
};

export const paginationQueryMiddleware = [paginationQueryCheck, pageNumberValidator, pageSizeValidator];
