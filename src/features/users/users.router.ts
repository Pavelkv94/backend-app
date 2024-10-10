import { Router } from "express";
import { adminMiddleware } from "../../global-middlewares/admin-middleware";
import { sortQueryMiddleware } from "../../global-middlewares/sort-query.middleware";
import { paginationQueryMiddleware } from "../../global-middlewares/pagination-query.middleware";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/inputCheckErrorsMiddleware";
import { postBodyValidators } from "../posts/middlewares/post-body.validator";
import { findBlogByBodyIdValidator } from "../posts/middlewares/findBlogByBodyId.validator.ts";
import { usersController } from "./users.controller";
import { findUserValidator } from "./middlewares/findUser.validator";
import { usersQueryValidator } from "./middlewares/users-query.validator";
import { userBodyValidators } from "./middlewares/user-body.validator";

export const usersRouter = Router();

usersRouter.get(
  "/",
  adminMiddleware,
  ...paginationQueryMiddleware,
  ...sortQueryMiddleware,
  usersQueryValidator,
  inputCheckErrorsMiddleware,
  usersController.getUsers
);
usersRouter.post("/", adminMiddleware, ...userBodyValidators, inputCheckErrorsMiddleware, usersController.createUser);
usersRouter.delete("/:id", adminMiddleware, findUserValidator, inputCheckErrorsMiddleware, usersController.deleteUser);
