import { NextFunction, Request, Response } from "express";
import { URIParamsUserModel, UserInputModel, UsersInputQueryModel, UsersValidInputQueryModel, UserViewModel } from "./models/users.models";
import { HTTP_STATUSES, OutputDataWithPagination } from "../../types/common-types";
import { userService, UserService } from "./users.service";
import { userQueryRepository, UserQueryRepository } from "./repositories/users.query-repository";
import { SortDirection } from "mongodb";
import { ApiError } from "../../exeptions/api-error";
import { authService } from "../auth/auth.service";

export class UserController {
  constructor(public userService: UserService, public userQueryRepository: UserQueryRepository) {

  }
  async getUsers(req: Request<{}, {}, {}, UsersInputQueryModel>, res: Response<OutputDataWithPagination<UserViewModel>>, next: NextFunction) {
    try {
      const queryData: UsersValidInputQueryModel = {
        pageNumber: +req.query.pageNumber,
        pageSize: +req.query.pageSize,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection as SortDirection,
        searchLoginTerm: req.query.searchLoginTerm,
        searchEmailTerm: req.query.searchEmailTerm,
      };
      console.log("ATTENTION: ", this.userQueryRepository)
      const users = await this.userQueryRepository.findAllUsers(queryData);

      res.status(HTTP_STATUSES.SUCCESS).json(users);
    } catch (error) {
      console.log("ATTENTION: ", this.userQueryRepository)

      return next(ApiError.UnexpectedError(error as Error));
    }
  }
  async createUser(req: Request<{}, {}, UserInputModel>, res: Response<UserViewModel>, next: NextFunction) {
    try {
      const userId = await this.userService.create(req.body);
      const newUser = await this.userQueryRepository.findUserById(userId);

      if (!newUser) {
        return next(ApiError.NotFound("The requested user was not found"));
      }

      await authService.setConfirmEmailStatus(newUser.id, true);

      res.status(201).json(newUser);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
  async deleteUser(req: Request<URIParamsUserModel>, res: Response, next: NextFunction) {
    try {
      const isDeletedUser = await this.userService.deleteUser(req.params.id);

      if (!isDeletedUser) {
        return next(ApiError.NotFound("The requested user was not found"));
      } else {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT);
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  }
};

export const userController = new UserController(userService, userQueryRepository);
