import { UserViewModel, UserDocument } from "../domain/users.models";

export class UserViewDto {
  email: string;
  id: string;
  login: string;
  createdAt: string;

  constructor(model: UserDocument) {
    this.id = model._id.toString();
    this.login = model.login;
    this.email = model.email;
    this.createdAt = model.createdAt;
  }

  static mapToView(user: UserDocument): UserViewDto {
    return new UserViewDto(user);
  }

  static mapToViewArray(users: UserDocument[]): UserViewModel[] {
    return users.map((user) => this.mapToView(user));
  }
}

export class MeViewDto {
  email: string;
  userId: string;
  login: string;

  constructor(model: UserDocument) {
    this.userId = model._id.toString();
    this.login = model.login;
    this.email = model.email;
  }
}
