export type OutputDataWithPagination<T> = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
};

export enum ResultStatus {
  SUCCESS = 0,
  NOT_FOUND = 1,
  FORBIDDEN = 2,
}

export type ResultObject<T> = {
  status: ResultStatus;
  errorMessage?: string;
  data: T;
};

export enum HTTP_STATUSES {
  SUCCESS = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
  TOO_MANY_REQUESTS = 429

}