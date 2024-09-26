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
  isMembership: boolean
  createdAt: string
};

export type BlogOutputModel = BlogViewModel;

export type URIParamsBlogModel = {
  id: string;
};