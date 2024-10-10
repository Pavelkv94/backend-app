import { Request, Response } from "express";
import { URIParamsUserModel, UserInputModel, UsersInputQueryModel, UserViewModel } from "../../input-output-types/users-types";
import { OutputDataWithPagination } from "../../input-output-types/common-types";
import { usersService } from "./users.service";

export const usersController = {
  async getUsers(req: Request<{}, {}, {}, UsersInputQueryModel>, res: Response<OutputDataWithPagination<UserViewModel>>) {},
  async createUser(req: Request<{}, {}, UserInputModel>, res: Response<UserViewModel>) {
    const newUser = await usersService.create(req.body);

    res.status(201).json(newUser!);
  },
  async deleteUser(req: Request<URIParamsUserModel>, res: Response) {},
};
