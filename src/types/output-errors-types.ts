import { BlogInputModel } from "../features/blogs/models/blogs.models";
import { CommentInputModel } from "../features/comments/models/comments.models";
import { PostInputModel } from "../features/posts/models/posts.models";
import { UserInputModel } from "../features/users/models/users.models";

export type FieldNamesType = keyof BlogInputModel | keyof PostInputModel | keyof CommentInputModel | keyof UserInputModel;

type ErrorMessageType = {
  message: string;
  field: string;
};

export type OutputErrorsType = {
  message?: string;
  errorsMessages: ErrorMessageType[];
};
