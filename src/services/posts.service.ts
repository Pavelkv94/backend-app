import { ObjectId } from "mongodb";
import { db, postCollection } from "../db/db";
import { PostDbType } from "../db/post-db-type";
import { PostInputModel, PostOutputModel, PostValidQueryModel } from "../input-output-types/posts-types";
import { postsRepository } from "../repositories/posts.repository";
import { blogsService } from "./blogs.service";
import { OutputDataWithPagination } from "../input-output-types/common-types";

export const postsService = {
  async findPosts(query: PostValidQueryModel): Promise<OutputDataWithPagination<PostDbType>> {
    const posts = await postsRepository.findPosts(query);

    const postsCount = await postsRepository.getPostsCount();

    return {
      pagesCount: Math.ceil(postsCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: postsCount,
      items: posts,
    };
  },

  async find(id: string): Promise<PostDbType | null> {
    const post = await postsRepository.find(id);

    return post;
  },

  async create(payload: PostInputModel): Promise<PostDbType | null> {
    const blog = await blogsService.find(payload.blogId);

    const id = new ObjectId();

    const newPost: PostDbType = {
      ...payload,
      id: id.toString(),
      blogName: blog!.name,
      createdAt: new Date().toISOString(),
    };

    await postsRepository.create(newPost);

    const post = await postsService.find(newPost.id);

    return post;
  },

  async update(id: string, payload: PostInputModel): Promise<boolean> {
    const blog = await blogsService.find(payload.blogId);

    const isUpdated = await postsRepository.update(id, payload);
    return isUpdated;
  },

  async delete(id: string): Promise<boolean> {
    const isDeleted = await postsRepository.delete(id);
    return isDeleted;
  },
};
