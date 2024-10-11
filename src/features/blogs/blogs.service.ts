import { BlogEntityModel, BlogInputModel, BlogValidQueryModel, BlogViewModel } from "../../input-output-types/blogs-types";
import { blogsQueryRepository } from "./blogs.query-repository";
import { blogsRepository } from "./blogs.repository";

export const blogsService = {
  async createBlog(payload: BlogInputModel): Promise<any> {
    const newBlog: BlogEntityModel = {
      name: payload.name,
      description: payload.description,
      websiteUrl: payload.websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };
    const id: string = await blogsRepository.createBlog(newBlog);

    const newBlogs = await blogsQueryRepository.findBlog(id);

    return newBlogs;
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
