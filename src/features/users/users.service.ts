import { usersRepository } from "./users.repository";
import { UserEntityModel, UserInputModel } from "../../input-output-types/users-types";
import { bcryptService } from "../../utils/bcrypt.service";

export const usersService = {
  async create(payload: UserInputModel): Promise<string> {
    const passwordhash = await bcryptService.generateHash(payload.password);

    const newUser: UserEntityModel = {
      login: payload.login,
      email: payload.email,
      password: passwordhash,
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
