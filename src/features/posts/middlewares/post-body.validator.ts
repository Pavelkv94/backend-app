import { body } from "express-validator";
import { blogsRepository } from "../../blogs/blogs.repository";
import { inputCheckErrorsMiddleware } from "../../../global-middlewares/inputCheckErrors.middleware";

// title: string // max 30
// shortDescription: string // max 100
// content: string // max 1000
// blogId: string // valid

const postTitleInputValidator = body("title").isString().withMessage("not string").trim().isLength({ min: 1, max: 30 }).withMessage("no more than 30 symbols");

const postShortDescriptionInputValidator = body("shortDescription")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("no more than 100 symbols");
const postContentInputValidator = body("content")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("no more than 1000 symbols");

export const findBlogByBodyIdValidator = body("blogId").custom(async (blogId) => {
  const blog = await blogsRepository.findBlog(blogId);
  if (!blog) {
    throw new Error("no blog!");
  }
});

export const postBodyValidators = [postTitleInputValidator, postShortDescriptionInputValidator, postContentInputValidator, inputCheckErrorsMiddleware];
