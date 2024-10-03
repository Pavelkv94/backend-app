import { Router } from "express";
import { postsController } from "../constrollers/posts.controller";
import { adminMiddleware } from "../middlewares/admin-middleware";
import { sortQueryMiddleware } from "../middlewares/sort-query.middleware";
import { paginationQueryMiddleware } from "../middlewares/pagination-query.middleware";
import { inputCheckErrorsMiddleware } from "../middlewares/inputCheckErrorsMiddleware";
import { postBodyValidators } from "../middlewares/postMiddlewares/post-body.validator";
import { findPostValidator } from "../middlewares/postMiddlewares/findPost.validator";
import { findBlogByBodyIdValidator } from "../middlewares/postMiddlewares/findBlogByBodyId.validator.ts";

export const postsRouter = Router();

postsRouter.get("/", ...paginationQueryMiddleware, ...sortQueryMiddleware, inputCheckErrorsMiddleware, postsController.getPosts);
postsRouter.get("/:id", findPostValidator, postsController.getPost);
postsRouter.post("/", adminMiddleware, ...postBodyValidators, findBlogByBodyIdValidator, inputCheckErrorsMiddleware, postsController.createPost);
postsRouter.put("/:id", adminMiddleware, findPostValidator, ...postBodyValidators,findBlogByBodyIdValidator,  inputCheckErrorsMiddleware, postsController.updatePost);
postsRouter.delete("/:id", adminMiddleware, findPostValidator, postsController.deletePost);
