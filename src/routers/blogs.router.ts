import { Router } from "express";
import { adminMiddleware } from "../middlewares/admin-middleware";
import { blogsController } from "../constrollers/blogs.controller";
import { blogValidators, findBlogValidator } from "../middlewares/blogValidators";

export const blogsRouter = Router();

blogsRouter.get("/", blogsController.getBlogs);
blogsRouter.get("/:id", findBlogValidator, blogsController.getBlog);
blogsRouter.post("/", ...blogValidators, blogsController.createBlog);
blogsRouter.put("/:id", findBlogValidator, ...blogValidators, blogsController.updateBlog);
blogsRouter.delete("/:id", adminMiddleware, findBlogValidator, blogsController.deleteBlog);
