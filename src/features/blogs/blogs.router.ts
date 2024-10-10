import { Router } from "express";
import { adminMiddleware } from "../../middlewares/admin-middleware";
import { blogsController } from "./blogs.controller";
import { blogBodyValidators } from "./middlewares/blog-body.validator";
import { inputCheckErrorsMiddleware } from "../../middlewares/inputCheckErrorsMiddleware";
import { sortQueryMiddleware } from "../../middlewares/sort-query.middleware";
import { paginationQueryMiddleware } from "../../middlewares/pagination-query.middleware";
import { blogQueryValidator } from "./middlewares/blog-query.validator";
import { findBlogByParamIdValidator } from "./middlewares/findBlogByParamId.validator";
import { postBodyValidators } from "../posts/middlewares/post-body.validator";

export const blogsRouter = Router();

blogsRouter.get("/", ...paginationQueryMiddleware, ...sortQueryMiddleware, blogQueryValidator, inputCheckErrorsMiddleware, blogsController.getBlogs);
blogsRouter.get("/:id", findBlogByParamIdValidator, blogsController.getBlog);
blogsRouter.post("/", adminMiddleware, ...blogBodyValidators, inputCheckErrorsMiddleware, blogsController.createBlog);
blogsRouter.put("/:id", adminMiddleware, findBlogByParamIdValidator, ...blogBodyValidators, inputCheckErrorsMiddleware, blogsController.updateBlog);
blogsRouter.delete("/:id", adminMiddleware, findBlogByParamIdValidator, blogsController.deleteBlog);

blogsRouter.get(
  "/:id/posts",
  findBlogByParamIdValidator,
  ...paginationQueryMiddleware,
  ...sortQueryMiddleware,
  inputCheckErrorsMiddleware,
  blogsController.getBlogPosts
);
blogsRouter.post("/:id/posts", adminMiddleware, findBlogByParamIdValidator, postBodyValidators, inputCheckErrorsMiddleware, blogsController.createBlogPost);
