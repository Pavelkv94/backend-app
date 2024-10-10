import { LoginInputModel } from "../../input-output-types/auth-types";
import { usersRepository } from "../users/users.repository";
import bcrypt from "bcrypt";

export const authService = {
  async checkCredentials(payload: LoginInputModel): Promise<boolean> {
    const user = await usersRepository.findUserByLoginOrEmail(payload.loginOrEmail);

    if (!user) {
      return false;
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordValid) {
      return false;
    }
    return true;
  },
};
