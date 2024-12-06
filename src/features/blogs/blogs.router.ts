import { Router } from "express";
import { adminMiddleware } from "../../global-middlewares/admin.middleware";
import { blogBodyValidators } from "./middlewares/blog-body.validator";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/inputCheckErrors.middleware";
import { sortQueryMiddleware } from "../../global-middlewares/sort-query.middleware";
import { paginationQueryMiddleware } from "../../global-middlewares/pagination-query.middleware";
import { postBodyValidators } from "../posts/middlewares/post-body.validator";
import { blogQueryMiddleware } from "./middlewares/blog-query.middleware";
import { findBlogByParamIdMiddleware } from "./middlewares/findBlogByParamId.middleware";
import { container } from "../../composition.root";
import { BlogController } from "./blogs.controller";

export const blogsRouter = Router();

const blogController = container.resolve(BlogController);

blogsRouter.get(
  "/",
  paginationQueryMiddleware,
  sortQueryMiddleware,
  blogQueryMiddleware,
  inputCheckErrorsMiddleware,
  blogController.getBlogs.bind(blogController)
);
blogsRouter.get("/:id", findBlogByParamIdMiddleware, blogController.getBlog.bind(blogController));
blogsRouter.post("/", adminMiddleware, blogBodyValidators, blogController.createBlog.bind(blogController));
blogsRouter.put("/:id", adminMiddleware, findBlogByParamIdMiddleware, blogBodyValidators, blogController.updateBlog.bind(blogController));
blogsRouter.delete("/:id", adminMiddleware, findBlogByParamIdMiddleware, blogController.deleteBlog.bind(blogController));

blogsRouter.get(
  "/:id/posts",
  findBlogByParamIdMiddleware,
  ...paginationQueryMiddleware,
  ...sortQueryMiddleware,
  inputCheckErrorsMiddleware,
  blogController.getBlogPosts.bind(blogController)
);
blogsRouter.post("/:id/posts", adminMiddleware, findBlogByParamIdMiddleware, ...postBodyValidators, blogController.createBlogPost.bind(blogController));
