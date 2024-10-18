import { Request, Response } from "express";
import { URIParamsUserModel, UserInputModel, UsersInputQueryModel, UsersValidInputQueryModel, UserViewModel } from "./models/users.models";
import { OutputDataWithPagination } from "../../types/common-types";
import { usersService } from "./users.service";
import { usersQueryRepository } from "./users.query-repository";
import { SortDirection } from "mongodb";
import { OutputErrorsType } from "../../types/output-errors-types";
import { handleUnexpectedError } from "../../exeptions/unexpectedError";

export const usersController = {
  async getUsers(req: Request<{}, {}, {}, UsersInputQueryModel>, res: Response<OutputDataWithPagination<UserViewModel>>) {
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
      handleUnexpectedError(res, error as Error);
    }
  },
  async createUser(req: Request<{}, {}, UserInputModel>, res: Response<UserViewModel | OutputErrorsType>) {
    try {
      const newUserId = await usersService.create(req.body);
      const newUser = await usersQueryRepository.findUser(newUserId);

      if (!newUser) {
        throw new Error("user not found");
      }

      res.status(201).json(newUser);
    } catch (error) {
      handleUnexpectedError(res, error as Error);
    }
  },
  async deleteUser(req: Request<URIParamsUserModel>, res: Response) {
    try {
      const isDeletedUser = await usersService.deleteUser(req.params.id);

      if (!isDeletedUser) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    } catch (error) {
      handleUnexpectedError(res, error as Error);
    }
  },
};
