import { BlogEntityModel, BlogInputModel, BlogValidQueryModel, BlogViewModel } from "./models/blogs.models";
import { blogsRepository } from "./blogs.repository";

export const blogsService = {
  async createBlog(payload: BlogInputModel): Promise<string> {
    const newBlog: BlogEntityModel = {
      name: payload.name,
      description: payload.description,
      websiteUrl: payload.websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };
    const id: string = await blogsRepository.createBlog(newBlog);

    return id;
  },

  async updateBlog(id: string, payload: BlogInputModel): Promise<boolean> {
    const isUpdated = await blogsRepository.updateBlog(id, payload);

    return isUpdated;
  },

  async deleteBlog(id: string): Promise<boolean> {
    const isDeletedBlog = await blogsRepository.deleteBlog(id);

    return isDeletedBlog;
  },
};
