import { BlogEntityModel, BlogInputModel, BlogValidQueryModel, BlogViewModel } from "./models/blogs.models";
import { BlogRepository, blogRepository } from "./repositories/blogs.repository";
import { BlogModel } from "../../db/models/Blog.model";

export class BlogService {
  constructor(public blogRepository: BlogRepository) {}

  async createBlog(payload: BlogInputModel): Promise<string> {
    const newBlog: BlogEntityModel = {
      name: payload.name,
      description: payload.description,
      websiteUrl: payload.websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };

    const blog = new BlogModel(newBlog);

    const id: string = await this.blogRepository.save(blog);

    return id;
  }

  async updateBlog(id: string, payload: BlogInputModel): Promise<boolean> {
    const isUpdated = await this.blogRepository.updateBlog(id, payload);

    return isUpdated;
  }

  async deleteBlog(id: string): Promise<boolean> {
    const isDeletedBlog = await this.blogRepository.deleteBlog(id);

    return isDeletedBlog;
  }
}

export const blogService = new BlogService(blogRepository);
