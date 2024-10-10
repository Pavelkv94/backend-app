import { ObjectId } from "mongodb";
import { usersRepository } from "./users.repository";
import { UserEntityModel, UserInputModel, UsersValidInputQueryModel, UserViewModel } from "../../input-output-types/users-types";

export const usersService = {
  async create(payload: UserInputModel): Promise<string> {
    const newUser: UserEntityModel = {
      login: payload.login,
      email: payload.email,
      password: payload.password,
      createdAt: new Date().toISOString(),
    };

    const userId = await usersRepository.create(newUser);

    return userId;
  },
  async deleteUser(id: string): Promise<boolean> {
    const isDeleted = await usersRepository.deleteUser(id);
    return isDeleted;
  },
};
