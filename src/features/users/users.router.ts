import { Router } from "express";
import { adminMiddleware } from "../../middlewares/admin-middleware";
import { sortQueryMiddleware } from "../../middlewares/sort-query.middleware";
import { paginationQueryMiddleware } from "../../middlewares/pagination-query.middleware";
import { inputCheckErrorsMiddleware } from "../../middlewares/inputCheckErrorsMiddleware";
import { postBodyValidators } from "../posts/middlewares/post-body.validator";
import { findBlogByBodyIdValidator } from "../posts/middlewares/findBlogByBodyId.validator.ts";
import { usersController } from "./users.controller";
import { findUserValidator } from "./middlewares/findUser.validator";

export const usersRouter = Router();

usersRouter.get("/", adminMiddleware, ...paginationQueryMiddleware, ...sortQueryMiddleware, inputCheckErrorsMiddleware, usersController.getUsers);
usersRouter.post("/", adminMiddleware, ...postBodyValidators, findBlogByBodyIdValidator, inputCheckErrorsMiddleware, usersController.createUser);
usersRouter.delete("/:id", adminMiddleware, findUserValidator, usersController.deleteUser);
