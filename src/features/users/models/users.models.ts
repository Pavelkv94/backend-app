import { SortDirection } from "mongodb";
import { HydratedDocument } from "mongoose";

export type EmailConfirmationEntityType = {
  confirmationCode: string;
  expirationDate: string;
  isConfirmed: boolean;
};
export type RecoveryPasswordEntityType = {
  recoveryCode: string | null;
  expirationDate: string | null;
};
export type UserEntityModel = {
  login: string;
  email: string;
  password: string;
  createdAt: string;
  emailConfirmation: EmailConfirmationEntityType;
  recoveryConfirmation: RecoveryPasswordEntityType;
};

export type UserPasswordModel = {
  password: string;
  id: string;
};

export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

// export type ExpandedUserViewModel = UserViewModel & {
//   emailConfirmation: EmailConfirmationEntityType;
//   recoveryConfirmation: RecoveryPasswordEntityType;
// };

export type UserInputModel = {
  login: string;
  password: string;
  email: string;
};

export type URIParamsUserModel = {
  id: string;
};

export type UsersInputQueryModel = {
  sortBy: string;
  sortDirection: string;
  pageNumber: string;
  pageSize: string;
  searchLoginTerm: string;
  searchEmailTerm: string;
};

export type UsersValidInputQueryModel = {
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
  searchLoginTerm: string;
  searchEmailTerm: string;
};

export type UserDocument = HydratedDocument<UserEntityModel>;
