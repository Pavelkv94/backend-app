import { ResolutionsType } from "../db/video-db-type";

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

export type InputVideoType = {
  title: string;
  author: string;
  availableResolutions: ResolutionsType;
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
