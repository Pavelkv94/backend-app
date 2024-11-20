import { BlogDocument, BlogViewModel } from "../models/blogs.models";

export class BlogViewDto {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
  createdAt: string;

  constructor(model: BlogDocument) {
    this.id = model._id.toString();
    this.name = model.name;
    this.description = model.description;
    this.websiteUrl = model.websiteUrl;
    this.isMembership = model.isMembership;
    this.createdAt = model.createdAt;
  }

  static mapToView(blog: BlogDocument): BlogViewModel {
    return new BlogViewDto(blog);
  }

  static mapToViewArray(blogs: BlogDocument[]): BlogViewModel[] {
    return blogs.map((blog) => this.mapToView(blog));
  }
}
