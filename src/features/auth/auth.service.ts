import { LoginInputModel } from "./models/auth.models";
import { bcryptService } from "../../adapters/bcrypt.service";
import { jwtService } from "../../adapters/jwt.service";
import { usersRepository } from "../users/users.repository";
import { UserInputModel } from "../users/models/users.models";
import { randomUUID } from "crypto";
import { getExpirationDate } from "../../utils/date/getExpirationDate";

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
  async setConfirmEmailStatus(user_id: string, status: boolean): Promise<boolean> {
    const isChanged = await usersRepository.setConfirmEmailStatus(user_id, true);

    return isChanged;
  },
  async setNewConfirmCode(user_id: string): Promise<string> {
    const newConfirmationCode = randomUUID();
    const newExpirationDate = getExpirationDate(30);

    const isUpdatedUserConfirmation = await usersRepository.setConfirmCode(user_id, newConfirmationCode, newExpirationDate);

    if (!isUpdatedUserConfirmation) {
      throw new Error("Update User confirmation Failed");
    }
    return newConfirmationCode;
  },
};
