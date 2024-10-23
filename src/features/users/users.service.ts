import { usersRepository } from "./users.repository";
import { UserEntityModel, UserInputModel } from "./models/users.models";
import { bcryptService } from "../../adapters/bcrypt.service";
import { randomUUID } from "crypto";
import { getExpirationDate } from "../../utils/date/getExpirationDate";

export const usersService = {
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
        isConfirmed: false
    }
    };

    const userId = await usersRepository.create(newUser);

    return userId;
  },
  async deleteUser(id: string): Promise<boolean> {
    const isDeleted = await usersRepository.deleteUser(id);
    return isDeleted;
  },
};
