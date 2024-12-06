import { BlogEntityModel, BlogInputModel, BlogValidQueryModel, BlogViewModel } from "./models/blogs.models";
import { blogRepository, BlogRepository } from "./repositories/blogs.repository";
import { BlogModel } from "../../db/models/Blog.model";
import { injectable } from "inversify";

@injectable()
export class BlogService {
  constructor(private blogRepository: BlogRepository) {}

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

  async updateBlog(id: string, payload: BlogInputModel): Promise<string | null> {
    const blog = await this.blogRepository.findBlog(id);
    if (!blog) {
      return null;
    }

    blog.name = payload.name;
    blog.description = payload.description;
    blog.websiteUrl = payload.websiteUrl;

    const updatedBlogId = await this.blogRepository.save(blog);

    return updatedBlogId;
  }

  async deleteBlog(id: string): Promise<boolean> {
    const isDeletedBlog = await this.blogRepository.deleteBlog(id);

    return isDeletedBlog;
  }
}

export const blogService = new BlogService(blogRepository);
