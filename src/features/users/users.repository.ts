import { UserEntityModel, UserPasswordModel, UserViewModel } from "./models/users.models";
import { UserModel } from "../../db/models/User.model";
import { UserViewDto } from "./dto";

export const usersRepository = {
  async findUser(id: string): Promise<UserViewModel | null> {
    const userFromDb = await UserModel.findOne({ _id: id });

    if (!userFromDb) {
      return null;
    }

    const { emailConfirmation, recoveryConfirmation, ...rest } = UserViewDto.mapToView(userFromDb);
    return rest;
  },
  async findUserPassByLoginOrEmail(loginOrEmail: string): Promise<UserPasswordModel | null> {
    const userFromDb = await UserModel.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] }).lean();

    if (!userFromDb) {
      return null;
    }

    const { _id, password } = userFromDb;
    return { id: _id.toString(), password };
  },
  async create(payload: UserEntityModel): Promise<string> {
    const result = await UserModel.create(payload);

    return result.id;
  },
  async deleteUser(id: string): Promise<boolean> {
    const result = await UserModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  },
  async setConfirmEmailStatus(user_id: string, status: boolean): Promise<boolean> {
    const result = await UserModel.updateOne({ _id: user_id }, { $set: { "emailConfirmation.isConfirmed": status } });

    return result.matchedCount > 0;
  },
  async setConfirmCode(user_id: string, newCode: string, newDate: string): Promise<boolean> {
    const result = await UserModel.updateOne(
      { _id: user_id },
      { $set: { "emailConfirmation.confirmationCode": newCode, "emailConfirmation.expirationDate": newDate } }
    );

    return result.matchedCount > 0;
  },
  async setRecoveryCode(user_id: string, newCode: string, newDate: string): Promise<boolean> {
    const result = await UserModel.updateOne(
      { _id: user_id },
      { $set: { "recoveryConfirmation.recoveryCode": newCode, "recoveryConfirmation.expirationDate": newDate } }
    );

    return result.matchedCount > 0;
  },

  async updatePass(user_id: string, newPass: string) {
    const result = await UserModel.updateOne({ _id: user_id }, { $set: { password: newPass } });

    return result.matchedCount > 0;
  },
};
