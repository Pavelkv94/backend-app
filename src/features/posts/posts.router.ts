import { Router } from "express";
import { postsController } from "./posts.controller";

export const postsRouter = Router();

postsRouter.get("/", postsController.getPosts);
postsRouter.get("/:id", postsController.getPost);
postsRouter.post("/", postsController.createPost);
postsRouter.put("/:id", postsController.updatePost);
postsRouter.delete("/:id", postsController.deletePost);
