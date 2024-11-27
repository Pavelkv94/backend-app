import { UserEntityModel, UserInputModel, UserViewModel } from "./models/users.models";
import { BcryptService, bcryptService } from "../../adapters/bcrypt.service";
import { randomUUID } from "crypto";
import { getExpirationDate } from "../../utils/date/getExpirationDate";
import { UserModel } from "../../db/models/User.model";
import { userRepository, UserRepository } from "./repositories/users.repository";

export class UserService {
  constructor(private userRepository: UserRepository, private bcryptService: BcryptService) {}

  async findUser(user_id: string): Promise<string | null> {
    const userId = await this.userRepository.findUserById(user_id);

    return userId;
  }
  async create(payload: UserInputModel): Promise<string> {
    const passwordhash = await this.bcryptService.generateHash(payload.password);

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
        recoveryCode: null,
        expirationDate: null,
      },
    };

    const user = new UserModel(newUser);
    const userId = await this.userRepository.save(user);

    return userId;
  }
  async updateUserPass(user_id: string, newPass: string): Promise<boolean> {
    const passwordhash = await this.bcryptService.generateHash(newPass);

    const isUpdated = await this.userRepository.updatePass(user_id, passwordhash);

    return isUpdated;
  }
  async deleteUser(id: string): Promise<boolean> {
    const isDeleted = await this.userRepository.deleteUser(id);
    return isDeleted;
  }
}

export const userService = new UserService(userRepository, bcryptService);
