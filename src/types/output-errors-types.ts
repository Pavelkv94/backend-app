import { BlogInputModel } from "../features/blogs/models/blogs.models";
import { PostInputModel } from "../features/posts/models/posts.models";

export type FieldNamesType = keyof BlogInputModel | keyof PostInputModel;

export type OutputErrorsType = {
  errorsMessages: ErrorMessageType[];
};

type ErrorMessageType = {
  message: string;
  field?: string;
};
