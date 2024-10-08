import { ObjectId } from "mongodb";

export type UserDbType = {
  _id: ObjectId;
  id: string;
  login: string;
  email: string;
  password: string;
  createdAt: string;
};
