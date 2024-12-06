import { injectable } from "inversify";
import { UserModel } from "../domain/User.entity";
import { UserPasswordModel, UserDocument } from "../domain/users.models";

@injectable()
export class UserRepository {
  async findUserById(id: string): Promise<UserDocument | null> {
    const userDocument = await UserModel.findOne({ _id: id });
    if (!userDocument) {
      return null;
    }

    return userDocument;
  }
  async save(user: UserDocument): Promise<string> {
    const result = await user.save();

    return result.id;
  }
  async findConfirmationCodeByUserId(id: string): Promise<string | null> {
    const userDocument = await UserModel.findOne({ _id: id }).lean();

    if (!userDocument) {
      return null;
    }

    return userDocument.emailConfirmation.confirmationCode;
  }
  async findUserPassByLoginOrEmail(loginOrEmail: string): Promise<UserPasswordModel | null> {
    const userDocument = await UserModel.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] }).lean();

    if (!userDocument) {
      return null;
    }

    const { _id, password } = userDocument;
    return { id: _id.toString(), password };
  }

  async findUserByRecoveryCode(code: string): Promise<string | null> {
    const userDocument = await UserModel.findOne({ "recoveryConfirmation.recoveryCode": code });

    if (!userDocument) {
      return null;
    }

    return userDocument.id;
  }
  async deleteUser(id: string): Promise<boolean> {
    const result = await UserModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
