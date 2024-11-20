import { Router } from "express";
import { adminMiddleware } from "../../global-middlewares/admin.middleware";
import { sortQueryMiddleware } from "../../global-middlewares/sort-query.middleware";
import { paginationQueryMiddleware } from "../../global-middlewares/pagination-query.middleware";
import { inputCheckErrorsMiddleware } from "../../global-middlewares/inputCheckErrors.middleware";
import { findUserMiddleware } from "./middlewares/findUser.middleware";
import { usersQueryMiddleware } from "./middlewares/users-query.middleware";
import { userBodyValidators } from "./middlewares/user-body.validator";
import { userController } from "./users.controller";

export const usersRouter = Router();

usersRouter.get(
  "/",
  adminMiddleware,
  paginationQueryMiddleware,
  sortQueryMiddleware,
  usersQueryMiddleware,
  inputCheckErrorsMiddleware,
  userController.getUsers.bind(userController)
);
usersRouter.post("/", adminMiddleware, userBodyValidators, userController.createUser.bind(userController));
usersRouter.delete("/:id", adminMiddleware, findUserMiddleware, userController.deleteUser.bind(userController));
