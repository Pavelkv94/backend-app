import { SortDirection } from "mongodb";

export type UserEntityModel = {
  login: string;
  email: string;
  password: string;
  createdAt: string;
};

export type UserViewModel = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

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
