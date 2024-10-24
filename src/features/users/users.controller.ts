import { NextFunction, Request, Response } from "express";
import { URIParamsUserModel, UserInputModel, UsersInputQueryModel, UsersValidInputQueryModel, UserViewModel } from "./models/users.models";
import { HTTP_STATUSES, OutputDataWithPagination } from "../../types/common-types";
import { usersService } from "./users.service";
import { usersQueryRepository } from "./users.query-repository";
import { SortDirection } from "mongodb";
import { ApiError } from "../../exeptions/api-error";
import { authService } from "../auth/auth.service";

export const usersController = {
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

      const users = await usersQueryRepository.findAllUsers(queryData);
      res.status(HTTP_STATUSES.SUCCESS).json(users);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async createUser(req: Request<{}, {}, UserInputModel>, res: Response<UserViewModel>, next: NextFunction) {
    try {
      const newUserId = await usersService.create(req.body);
      await authService.setConfirmEmailStatus(newUserId, true);
      const newUser = await usersQueryRepository.findUser(newUserId);

      if (!newUser) {
        return next(ApiError.NotFound("The requested user was not found"));
      }

      res.status(201).json(newUser);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async deleteUser(req: Request<URIParamsUserModel>, res: Response, next: NextFunction) {
    try {
      const isDeletedUser = await usersService.deleteUser(req.params.id);

      if (!isDeletedUser) {
        return next(ApiError.NotFound("The requested user was not found"));
      } else {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT);
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
};
