import { NextFunction, Request, Response } from "express";
import { URIParamsUserModel, UserInputModel, UsersInputQueryModel, UsersValidInputQueryModel, UserViewModel } from "./models/users.models";
import { OutputDataWithPagination } from "../../types/common-types";
import { usersService } from "./users.service";
import { usersQueryRepository } from "./users.query-repository";
import { SortDirection } from "mongodb";
import { OutputErrorsType } from "../../types/output-errors-types";
import { ApiError } from "../../exeptions/api-error";

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
      res.status(200).json(users);
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
  async createUser(req: Request<{}, {}, UserInputModel>, res: Response<UserViewModel | OutputErrorsType>, next: NextFunction) {
    try {
      const newUserId = await usersService.create(req.body);
      const newUser = await usersQueryRepository.findUser(newUserId);

      if (!newUser) {
        throw new Error("user not found");
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
        return next(ApiError.NotFound("The requested resource was not found"));
      } else {
        res.sendStatus(204);
      }
    } catch (error) {
      return next(ApiError.UnexpectedError(error as Error));
    }
  },
};
