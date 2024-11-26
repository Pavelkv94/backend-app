import { Schema, model } from "mongoose";
import { WithId } from "mongodb";
import { UserEntityModel } from "../../features/users/models/users.models";

const UserSchema = new Schema<WithId<UserEntityModel>>({
  login: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
  createdAt: { type: String, require: true },
  emailConfirmation: {
    confirmationCode: { type: String, require: true },
    expirationDate: { type: String, require: true },
    isConfirmed: { type: Boolean, require: true },
  },
  recoveryConfirmation: {
    recoveryCode: { type: String, require: false, default: null },
    expirationDate: { type: String, require: false, default: null },
  },
});

export const UserModel = model<WithId<UserEntityModel>>("users", UserSchema);
