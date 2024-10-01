import { SortDirection } from "mongodb";

export type BlogInputModel = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type BlogViewModel = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: string;
};

export type BlogOutputModel = BlogViewModel;

export type URIParamsBlogModel = {
  id: string;
};

export type BlogInputQueryModel = {
  searchNameTerm: string;
  sortBy: string;
  sortDirection: string;
  pageNumber: string;
  pageSize: string;
};

export type BlogValidQueryModel = {
  searchNameTerm: string;
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
