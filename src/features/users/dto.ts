import { EmailConfirmationEntityType, RecoveryPasswordEntityType, UserDocument, UserViewModel } from "./models/users.models";

export class UserViewDto {
  email: string;
  id: string;
  login: string;
  createdAt: string;
  emailConfirmation: EmailConfirmationEntityType;
  recoveryConfirmation: RecoveryPasswordEntityType;

  constructor(model: UserDocument) {
    this.id = model._id.toString();
    this.login = model.login;
    this.email = model.email;
    this.createdAt = model.createdAt;
    this.emailConfirmation = model.emailConfirmation;
    this.recoveryConfirmation = model.recoveryConfirmation;
  }

  static mapToView(user: UserDocument): UserViewDto {
    return new UserViewDto(user);
  }

  static mapToViewArray(users: UserDocument[]): UserViewModel[] {
    return users.map((user) => {
      const { emailConfirmation, recoveryConfirmation, ...rest } = this.mapToView(user);
      return rest;
    });
  }
}

export class MeDto {
  email: string;
  userId: string;
  login: string;

  constructor(model: UserDocument) {
    this.userId = model._id.toString();
    this.login = model.login;
    this.email = model.email;
  }
}
