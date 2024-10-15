import { Router } from "express";
import { postsController } from "./posts.controller";
import { adminMiddleware } from "../../global-middlewares/admin.middleware";
import { sortQueryMiddleware } from "../../global-middlewares/sort-query.middleware";
import { paginationQueryMiddleware } from "../../global-middlewares/pagination-query.middleware";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/inputCheckErrors.middleware";
import { postBodyValidators } from "./middlewares/post-body.validator";
import { findPostValidator } from "./middlewares/findPost.validator";
import { findBlogByBodyIdValidator } from "./middlewares/findBlogByBodyId.validator.ts";

export const postsRouter = Router();

postsRouter.get("/", ...paginationQueryMiddleware, ...sortQueryMiddleware, inputCheckErrorsMiddleware, postsController.getPosts);
postsRouter.get("/:id", findPostValidator, postsController.getPost);
postsRouter.post("/", adminMiddleware, ...postBodyValidators, findBlogByBodyIdValidator, inputCheckErrorsMiddleware, postsController.createPost);
postsRouter.put(
  "/:id",
  adminMiddleware,
  findPostValidator,
  ...postBodyValidators,
  findBlogByBodyIdValidator,
  inputCheckErrorsMiddleware,
  postsController.updatePost
);
postsRouter.delete("/:id", adminMiddleware, findPostValidator, postsController.deletePost);
