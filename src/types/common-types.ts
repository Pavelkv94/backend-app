export type OutputDataWithPagination<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
};

export enum ResultStatus {
  SUCCESS = 0,
  NOT_FOUND = 2,
  FORBIDDEN = 403,
}

export type ResultObject<T> = {
  status: ResultStatus;
  errorMessage?: string;
  data: T;
};
