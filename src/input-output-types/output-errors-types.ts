import { BlogInputModel } from "./blogs-types";
import { PostInputModel } from "./posts-types";

export type FieldNamesType = keyof BlogInputModel | keyof PostInputModel;

export type OutputErrorsType = {
  errorsMessages: ErrorMEssageType[];
};

type ErrorMEssageType = {
  message: string;
  field: string;
};
