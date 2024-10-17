import { Router } from "express";
import { adminMiddleware } from "../../global-middlewares/admin.middleware";
import { blogsController } from "./blogs.controller";
import { blogBodyValidators } from "./middlewares/blog-body.validator";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/inputCheckErrors.middleware";
import { sortQueryMiddleware } from "../../global-middlewares/sort-query.middleware";
import { paginationQueryMiddleware } from "../../global-middlewares/pagination-query.middleware";
import { postBodyValidators } from "../posts/middlewares/post-body.validator";
import { blogQueryMiddleware } from "./middlewares/blog-query.middleware";
import { findBlogByParamIdMiddleware } from "./middlewares/findBlogByParamId.middleware";

export const blogsRouter = Router();

blogsRouter.get("/", ...paginationQueryMiddleware, ...sortQueryMiddleware, blogQueryMiddleware, inputCheckErrorsMiddleware, blogsController.getBlogs);
blogsRouter.get("/:id", findBlogByParamIdMiddleware, blogsController.getBlog);
blogsRouter.post("/", adminMiddleware, ...blogBodyValidators, inputCheckErrorsMiddleware, blogsController.createBlog);
blogsRouter.put("/:id", adminMiddleware, findBlogByParamIdMiddleware, ...blogBodyValidators, inputCheckErrorsMiddleware, blogsController.updateBlog);
blogsRouter.delete("/:id", adminMiddleware, findBlogByParamIdMiddleware, blogsController.deleteBlog);

blogsRouter.get(
  "/:id/posts",
  findBlogByParamIdMiddleware,
  ...paginationQueryMiddleware,
  ...sortQueryMiddleware,
  inputCheckErrorsMiddleware,
  blogsController.getBlogPosts
);
blogsRouter.post("/:id/posts", adminMiddleware, findBlogByParamIdMiddleware, postBodyValidators, inputCheckErrorsMiddleware, blogsController.createBlogPost);
