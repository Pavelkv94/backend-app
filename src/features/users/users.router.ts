import { Router } from "express";
import { adminMiddleware } from "../../global-middlewares/admin.middleware";
import { sortQueryMiddleware } from "../../global-middlewares/sort-query.middleware";
import { paginationQueryMiddleware } from "../../global-middlewares/pagination-query.middleware";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/inputCheckErrors.middleware";
import { usersController } from "./users.controller";
import { findUserMiddleware } from "./middlewares/findUser.middleware";
import { usersQueryMiddleware } from "./middlewares/users-query.middleware";
import { userBodyValidators } from "./middlewares/user-body.validator";

export const usersRouter = Router();

usersRouter.get(
  "/",
  adminMiddleware,
  ...paginationQueryMiddleware,
  ...sortQueryMiddleware,
  usersQueryMiddleware,
  inputCheckErrorsMiddleware,
  usersController.getUsers
);
usersRouter.post("/", adminMiddleware, ...userBodyValidators, inputCheckErrorsMiddleware, usersController.createUser);
usersRouter.delete("/:id", adminMiddleware, findUserMiddleware, inputCheckErrorsMiddleware, usersController.deleteUser);
