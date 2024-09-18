import { ResolutionsType } from "../db/video-db-type";

export type ParamVideoType = {
  id: string;
};
export type OutputVideoType = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: ResolutionsType;
};

export type InputVideoModel = {
  title: string;
  author: string;
  availableResolutions: ResolutionsType;
};

export type InputUpdateVideoType = {
  title: string;
  author: string;
  availableResolutions: ResolutionsType;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  publicationDate: string;
};

export type ViewVideoType = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: ResolutionsType;
};
