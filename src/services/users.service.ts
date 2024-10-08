import { ObjectId } from "mongodb";
import { UserDbType } from "../db/user-db-type";
import { usersRepository } from "../repositories/users.repository";
import { UserInputModel, UsersValidInputQueryModel } from "../input-output-types/users-types";

export const usersService = {
  async findAllUsers(query: UsersValidInputQueryModel) {
    const users = await usersRepository.findAll(query);

    const usersCount = await usersRepository.getUsersCount(query.searchNameTerm);

    return {
      pagesCount: Math.ceil(usersCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: usersCount,
      items: users,
    };
  },
  async create(payload: UserInputModel) {
    const id = new ObjectId();

    const newUser: UserDbType = {
      _id: id,
      id: id.toString(),
      login: payload.login,
      email: payload.email,
      password: payload.password,
      createdAt: new Date().toISOString(),
    };
    await usersRepository.create(newUser);

    const user = await usersRepository.find(newUser.id);

    return user;
  },
};
