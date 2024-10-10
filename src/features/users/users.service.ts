import { ObjectId } from "mongodb";
import { usersRepository } from "./users.repository";
import { UserEntityModel, UserInputModel, UsersValidInputQueryModel, UserViewModel } from "../../input-output-types/users-types";

export const usersService = {
  async findAllUsers(query: UsersValidInputQueryModel) {
    // const users = await usersRepository.findAll(query);
    // const usersCount = await usersRepository.getUsersCount(query.searchNameTerm);
    // return {
    //   pagesCount: Math.ceil(usersCount / query.pageSize),
    //   page: query.pageNumber,
    //   pageSize: query.pageSize,
    //   totalCount: usersCount,
    //   items: users,
    // };
  },
  async create(payload: UserInputModel): Promise<UserViewModel | null> {
    const newUser: UserEntityModel = {
      login: payload.login,
      email: payload.email,
      password: payload.password,
      createdAt: new Date().toISOString(),
    };
    const userId = await usersRepository.create(newUser);

    const user = await usersRepository.findUser(userId);

    return user;
  },
};
