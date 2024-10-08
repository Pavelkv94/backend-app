import { Router } from "express";
import { adminMiddleware } from "../middlewares/admin-middleware";
import { sortQueryMiddleware } from "../middlewares/sort-query.middleware";
import { paginationQueryMiddleware } from "../middlewares/pagination-query.middleware";
import { inputCheckErrorsMiddleware } from "../middlewares/inputCheckErrorsMiddleware";
import { postBodyValidators } from "../middlewares/postMiddlewares/post-body.validator";
import { findBlogByBodyIdValidator } from "../middlewares/postMiddlewares/findBlogByBodyId.validator.ts";
import { usersController } from "../constrollers/users.controller";
import { findUserValidator } from "../middlewares/userMiddleware/findUser.validator";

export const usersRouter = Router();

usersRouter.get("/", adminMiddleware, ...paginationQueryMiddleware, ...sortQueryMiddleware, inputCheckErrorsMiddleware, usersController.getUsers);
usersRouter.post("/", adminMiddleware, ...postBodyValidators, findBlogByBodyIdValidator, inputCheckErrorsMiddleware, usersController.createUser);
usersRouter.delete("/:id", adminMiddleware, findUserValidator, usersController.deleteUser);
