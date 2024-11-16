import { usersRepository } from "./users.repository";
import { UserEntityModel, UserInputModel, UserViewModel } from "./models/users.models";
import { bcryptService } from "../../adapters/bcrypt.service";
import { randomUUID } from "crypto";
import { getExpirationDate } from "../../utils/date/getExpirationDate";

export const usersService = {
  async findUser(user_id: string): Promise<UserViewModel | null> {
    const user = await usersRepository.findUser(user_id);

    return user;
  },
  async create(payload: UserInputModel): Promise<string> {
    const passwordhash = await bcryptService.generateHash(payload.password);

    const newUser: UserEntityModel = {
      login: payload.login,
      email: payload.email,
      password: passwordhash,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: getExpirationDate(30),
        isConfirmed: false,
      },
      recoveryConfirmation: {
        recoveryCode: "",
        expirationDate: "",
      },
    };

    const userId = await usersRepository.create(newUser);

    return userId;
  },
  async updateUserPass(user_id: string, newPass: string): Promise<boolean> {
    const passwordhash = await bcryptService.generateHash(newPass);

    const isUpdated = await usersRepository.updatePass(user_id, passwordhash);

    return isUpdated;
  },
  async deleteUser(id: string): Promise<boolean> {
    const isDeleted = await usersRepository.deleteUser(id);
    return isDeleted;
  },
};
