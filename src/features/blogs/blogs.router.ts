import { Router } from "express";
import { createBlogController } from "./controllers/createBlogController";
import { getBlogsController } from "./controllers/getBlogsController";
import { findBlogController } from "./controllers/findBlogController";
import { delBlogController } from "./controllers/delBlogController";
import { putBlogController } from "./controllers/putBlogController";
import { blogValidators, findBlogValidator } from "./middlewares/blogValidators";
import { adminMiddleware } from "../../global-middlewares/admin-middleware";
import { blogsController } from "./blogs.controller";

export const blogsRouter = Router();

blogsRouter.get("/", blogsController.getBlogs);
blogsRouter.get("/:id", blogsController.getBlog);
blogsRouter.post("/", adminMiddleware, blogsController.createBlog);
blogsRouter.put('/:id', adminMiddleware,  blogsController.updateBlog)
blogsRouter.delete('/:id', adminMiddleware, blogsController.deleteBlog)

// blogsRouter.get("/:id", findBlogValidator, findBlogController);
// blogsRouter.post("/", ...blogValidators, createBlogController);
// blogsRouter.put('/:id', findBlogValidator, ...blogValidators, putBlogController)
// blogsRouter.delete('/:id', adminMiddleware, findBlogValidator, delBlogController)

// не забудьте добавить роут в апп
