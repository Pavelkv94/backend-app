export type OutputErrorsType = {
  errorsMessages: ErrorMEssageType[];
};

type ErrorMEssageType = {
  message: string;
  field: string;
};
