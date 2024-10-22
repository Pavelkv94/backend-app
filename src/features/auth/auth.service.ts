import { LoginInputModel } from "./models/auth.models";
import { bcryptService } from "../../adapters/bcrypt.service";
import { jwtService } from "../../adapters/jwt.service";
import { usersRepository } from "../users/users.repository";
import { UserInputModel } from "../users/models/users.models";

export const authService = {
  async checkCredentials(payload: LoginInputModel): Promise<string | null> {
    const user = await usersRepository.findUserByLoginOrEmail(payload.loginOrEmail);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcryptService.checkPassword(payload.password, user.password);

    if (!isPasswordValid) {
      return null;
    }
    return jwtService.createToken({ user_id: user._id.toString() });
  },
};
