import { Router } from "express";
import { adminMiddleware } from "../middlewares/admin-middleware";
import { blogsController } from "../constrollers/blogs.controller";
import { blogValidators } from "../middlewares/blogMiddlewares/blog-body.validator";
import { inputCheckErrorsMiddleware } from "../middlewares/inputCheckErrorsMiddleware";
import { sortQueryMiddleware } from "../middlewares/sort-query.middleware";
import { paginationQueryMiddleware } from "../middlewares/pagination-query.middleware";
import { blogQueryValidator } from "../middlewares/blogMiddlewares/blog-query.validator";
import { findBlogValidator } from "../middlewares/blogMiddlewares/findBlog.validator";

export const blogsRouter = Router();

blogsRouter.get("/", ...paginationQueryMiddleware, ...sortQueryMiddleware, blogQueryValidator, inputCheckErrorsMiddleware, blogsController.getBlogs);
blogsRouter.get("/:id", findBlogValidator, blogsController.getBlog);
blogsRouter.post("/", adminMiddleware, ...blogValidators, inputCheckErrorsMiddleware, blogsController.createBlog);
blogsRouter.put("/:id", adminMiddleware, findBlogValidator, ...blogValidators, inputCheckErrorsMiddleware, blogsController.updateBlog);
blogsRouter.delete("/:id", adminMiddleware, findBlogValidator, blogsController.deleteBlog);
