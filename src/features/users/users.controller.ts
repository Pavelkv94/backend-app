import { Request, Response } from "express";
import { URIParamsUserModel, UserInputModel, UsersInputQueryModel, UsersValidInputQueryModel, UserViewModel } from "../../input-output-types/users-types";
import { OutputDataWithPagination } from "../../input-output-types/common-types";
import { usersService } from "./users.service";
import { usersQueryRepository } from "./users.query-repository";
import { SortDirection } from "mongodb";

export const usersController = {
  async getUsers(req: Request<{}, {}, {}, UsersInputQueryModel>, res: Response<OutputDataWithPagination<UserViewModel>>) {
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
  },
  async createUser(req: Request<{}, {}, UserInputModel>, res: Response<UserViewModel>) {
    const newUserId = await usersService.create(req.body);
    const newUser = await usersQueryRepository.findUser(newUserId);

    if (!newUser) {
      res.sendStatus(500); //! уточнить ошибку
      return;
    }

    res.status(201).json(newUser);
  },
  async deleteUser(req: Request<URIParamsUserModel>, res: Response) {
    const isDeletedUser = await usersService.deleteUser(req.params.id);

    if (!isDeletedUser) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  },
};
