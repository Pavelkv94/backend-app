import { BlogEntityModel, BlogInputModel, BlogValidQueryModel, BlogViewModel } from "../../input-output-types/blogs-types";
import { blogsRepository } from "./blogs.repository";

export const blogsService = {
  async createBlog(payload: BlogInputModel): Promise<BlogViewModel | null> {
    const newBlog: BlogEntityModel = {
      name: payload.name,
      description: payload.description,
      websiteUrl: payload.websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };
    const id: string = await blogsRepository.createBlog(newBlog);
    const blog = await blogsRepository.findBlog(id);

    return blog;
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
