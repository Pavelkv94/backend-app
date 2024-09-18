import { BlogInputModel } from "./blogs-types";
import { PostInputModel } from "./posts-types";
import { InputVideoModel } from "./video-types";

export type FieldNamesType = keyof BlogInputModel | keyof PostInputModel | keyof InputVideoModel;

export type OutputErrorsType = {
  errorsMessages: ErrorMEssageType[];
};

type ErrorMEssageType = {
  message: string;
  field: string;
};
