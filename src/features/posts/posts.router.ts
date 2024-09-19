import { Router } from "express";
import { postsController } from "./posts.controller";
import { adminMiddleware } from "../../global-middlewares/admin-middleware";

export const postsRouter = Router();

postsRouter.get("/", postsController.getPosts);
postsRouter.get("/:id", postsController.getPost);
postsRouter.post("/", adminMiddleware, postsController.createPost);
postsRouter.put("/:id", adminMiddleware, postsController.updatePost);
postsRouter.delete("/:id", adminMiddleware, postsController.deletePost);
