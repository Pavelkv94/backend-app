import { Router } from "express";
import { postsController } from "../constrollers/posts.controller";
import { adminMiddleware } from "../middlewares/admin-middleware";
import { findPostValidator, postInputValidators } from "../middlewares/postValidators";
import { sortQueryMiddleware } from "../middlewares/sort-query.middleware";
import { paginationQueryMiddleware } from "../middlewares/pagination-query.middleware";
import { inputCheckErrorsMiddleware } from "../middlewares/inputCheckErrorsMiddleware";

export const postsRouter = Router();

postsRouter.get("/", ...paginationQueryMiddleware, ...sortQueryMiddleware, inputCheckErrorsMiddleware, postsController.getPosts);
postsRouter.get("/:id", postsController.getPost);
postsRouter.post("/", ...postInputValidators, postsController.createPost);
postsRouter.put("/:id", ...postInputValidators, postsController.updatePost);
postsRouter.delete("/:id", adminMiddleware, findPostValidator, postsController.deletePost);
