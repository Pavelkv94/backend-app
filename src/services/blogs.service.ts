import { ObjectId, WithId } from "mongodb";
import { BlogDbType } from "../db/blog-db-type";
import { BlogInputModel, BlogValidQueryModel, BlogViewModel } from "../input-output-types/blogs-types";
import { blogsRepository } from "../repositories/blogs.repository";
import { OutputDataWithPagination } from "../input-output-types/common-types";

export const blogsService = {
  async findAll(query: BlogValidQueryModel): Promise<OutputDataWithPagination<BlogDbType>> {
    const blogs = await blogsRepository.findAll(query);

    const blogsCount = await blogsRepository.getBlogsCount(query.searchNameTerm);

    return {
      pagesCount: Math.ceil(blogsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: blogsCount,
      items: blogs,
    };
  },
  async find(id: string) {
    const blog = await blogsRepository.find(id);

    return blog;
  },

  async create(payload: BlogInputModel): Promise<WithId<BlogDbType> | null> {
    const id = new ObjectId();

    const newBlog: BlogViewModel = {
      id: id.toString(),
      name: payload.name,
      description: payload.description,
      websiteUrl: payload.websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };
    await blogsRepository.create(newBlog);
    const blog = await blogsRepository.find(newBlog.id);

    return blog;
  },

  async update(id: string, payload: BlogInputModel) {
    const isUpdated = await blogsRepository.update(id, payload);

    return isUpdated;
  },

  async delete(id: string) {
    const isDeletedBlog = await blogsRepository.delete(id);

    return isDeletedBlog;
  },
};
