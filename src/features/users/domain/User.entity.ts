import { Model, Schema, model } from "mongoose";
import { UserDocument, UserEntityModel } from "./users.models";
import { getExpirationDate } from "../../../utils/date/getExpirationDate";
import { randomUUID } from "crypto";

//* method type
export interface IUserMethods {
  setNewPassword: (newPassword: string) => void;
  setConfirmEmailStatus: (newStatus: boolean) => void;
  setConfirmCode: (confirmCode: string, expirationDate: string) => void;
  setRecoveryCode: (recoveryCode: string, expirationDate: string) => void;
}

//* common type without static method
// type IUserModel = Model<UserEntityModel, {}, IUserMethods>;

//* common type with static method
interface IUserModel extends Model<UserEntityModel, {}, IUserMethods> {
  buildInstance: (login: string, email: string, passwordhash: string) => UserDocument;
}

const UserSchema = new Schema<UserEntityModel, IUserModel, IUserMethods>({
  login: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: String, required: true },
  emailConfirmation: {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: String, required: true },
    isConfirmed: { type: Boolean, required: true },
  },
  recoveryConfirmation: {
    recoveryCode: { type: String, required: false, default: null },
    expirationDate: { type: String, required: false, default: null },
  },
});

//* setter
UserSchema.method("setNewPassword", function setNewPassword(newPassword: string) {
  const that = this as UserEntityModel & IUserMethods;
  that.password = newPassword;
});

//* setter
UserSchema.method("setConfirmCode", function setConfirmCode(confirmCode: string, expirationDate: string) {
  const that = this as UserEntityModel & IUserMethods;
  that.emailConfirmation.confirmationCode = confirmCode;
  that.emailConfirmation.expirationDate = expirationDate;
});

//* setter
UserSchema.method("setConfirmEmailStatus", function setConfirmEmailStatus(newStatus: boolean) {
  const that = this as UserEntityModel & IUserMethods;
  that.emailConfirmation.isConfirmed = newStatus;
});

//* setter
UserSchema.method("setRecoveryCode", function setRecoveryCode(recoveryCode: string, expirationDate: string) {
  const that = this as UserEntityModel & IUserMethods;
  that.recoveryConfirmation.recoveryCode = recoveryCode;
  that.recoveryConfirmation.expirationDate = expirationDate;
});

//* factory method
UserSchema.static("buildInstance", function buildInstance(login: string, email: string, passwordhash: string): UserDocument {
  return new UserModel({
    login: login,
    email: email,
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
  });
});

export const UserModel = model<UserEntityModel, IUserModel>("users", UserSchema);
