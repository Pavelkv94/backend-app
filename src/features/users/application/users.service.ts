import { BcryptService, bcryptService } from "../../../adapters/bcrypt.service";
import { userRepository, UserRepository } from "../infrastructure/users.repository";
import {  UserInputModel } from "../domain/users.models";
import { UserModel } from "../domain/User.entity";

export class UserService {
  constructor(private userRepository: UserRepository, private bcryptService: BcryptService) {}

  async findUser(user_id: string): Promise<string | null> {
    const user = await this.userRepository.findUserById(user_id);

    return user ? user.id : null;
  }
  async create(payload: UserInputModel): Promise<string> {
    const passwordhash = await this.bcryptService.generateHash(payload.password);
    const newUser = UserModel.buildInstance(payload.login, payload.email, passwordhash);

    const user = new UserModel(newUser);
    const userId = await this.userRepository.save(user);

    return userId;
  }
  async updateUserPass(user_id: string, newPass: string): Promise<boolean> {
    const passwordhash = await this.bcryptService.generateHash(newPass);

    const userDocument = await this.userRepository.findUserById(user_id);
    if (!userDocument) {
      return false;
    }

    userDocument.setNewPassword(passwordhash);

    const userId = await this.userRepository.save(userDocument);

    return !!userId;
  }
  async deleteUser(id: string): Promise<boolean> {
    const isDeleted = await this.userRepository.deleteUser(id);
    return isDeleted;
  }
}

export const userService = new UserService(userRepository, bcryptService);
