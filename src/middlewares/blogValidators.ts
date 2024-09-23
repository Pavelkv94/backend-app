import { body } from "express-validator";
import { inputCheckErrorsMiddleware } from "./inputCheckErrorsMiddleware";
import { NextFunction, Request, Response } from "express";
import { blogsRepository } from "../repositories/blogs.repository";
import { adminMiddleware } from "./admin-middleware";

// name: string // max 15
// description: string // max 500
// websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$

const nameValidator = body("name").isString().withMessage("not string").trim().isLength({ min: 1, max: 15 }).withMessage("no more than 15 symbols");
const descriptionValidator = body("description").isString().withMessage("not string").trim().isLength({ min: 1, max: 500 }).withMessage("more then 500 or 0");
const websiteUrlValidator = body("websiteUrl")
  .isString()
  .withMessage("not string")
  .trim()
  .isURL()
  .withMessage("not url")
  .isLength({ min: 1, max: 100 })
  .withMessage("more then 100 or 0");

export const findBlogValidator = (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const isBlogExist = blogsRepository.find(req.params.id);
  if (!isBlogExist) {
    res.sendStatus(404);
    return;
  }
  next();
};

export const blogValidators = [adminMiddleware, nameValidator, descriptionValidator, websiteUrlValidator, inputCheckErrorsMiddleware];
