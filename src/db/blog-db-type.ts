import { ObjectId } from "mongodb";

export type BlogDbType = {
  _id: ObjectId
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: string;
};
