import { NextFunction, Request, Response } from "express";
import { HTTP_STATUSES, OutputDataWithPagination } from "../../../types/common-types";
import { userService, UserService } from "../application/users.service";
import { SortDirection } from "mongodb";
import { ApiError } from "../../../exeptions/api-error";
import { authService } from "../../auth/auth.service";
import { URIParamsUserModel, UserInputModel, UsersInputQueryModel, UsersValidInputQueryModel, UserViewModel } from "../domain/users.models";
import { userQueryRepository, UserQueryRepository } from "../infrastructure/users.query-repository";

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
      const users = await this.userQueryRepository.findAllUsers(queryData);

      res.status(HTTP_STATUSES.SUCCESS).json(users);
    } catch (error) {

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
