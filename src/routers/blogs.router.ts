import { Router } from "express";
import { adminMiddleware } from "../middlewares/admin-middleware";
import { blogsController } from "../constrollers/blogs.controller";
import { blogBodyValidators } from "../middlewares/blogMiddlewares/blog-body.validator";
import { inputCheckErrorsMiddleware } from "../middlewares/inputCheckErrorsMiddleware";
import { sortQueryMiddleware } from "../middlewares/sort-query.middleware";
import { paginationQueryMiddleware } from "../middlewares/pagination-query.middleware";
import { blogQueryValidator } from "../middlewares/blogMiddlewares/blog-query.validator";
import { findBlogByParamIdValidator } from "../middlewares/blogMiddlewares/findBlogByParamId.validator";
import { postBodyValidators } from "../middlewares/postMiddlewares/post-body.validator";

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
