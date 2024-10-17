import { LoginInputModel } from "./models/auth.models";
import { bcryptService } from "../../utils/bcrypt.service";
import { jwtService } from "../../utils/jwt.service";
import { usersRepository } from "../users/users.repository";

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
