import { ObjectId } from "mongodb";
import { PostDbType } from "../db/post-db-type";
import { PostForBlogInputModel, PostInputModel, PostValidQueryModel, PostViewModel } from "../input-output-types/posts-types";
import { postsRepository } from "../repositories/posts.repository";
import { blogsService } from "./blogs.service";
import { OutputDataWithPagination } from "../input-output-types/common-types";

export const postsService = {
  async findAllPosts(query: PostValidQueryModel, blog_id?: string): Promise<OutputDataWithPagination<PostDbType>> {
    const posts = await postsRepository.findAllPosts(query, blog_id);

    const postsCount = await postsRepository.getPostsCount(blog_id);

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

    const newPost: PostViewModel = {
      ...payload,
      id: id.toString(),
      blogName: blog!.name,
      createdAt: new Date().toISOString(),
    };

    await postsRepository.create(newPost);

    const post = await postsService.find(newPost.id);

    return post;
  },

  async createForBlog(payload: PostForBlogInputModel, blog_id: string): Promise<PostDbType | null> {
    const blog = await blogsService.find(blog_id);

    const id = new ObjectId();

    const newPost: PostViewModel = {
      ...payload,
      id: id.toString(),
      blogName: blog!.name,
      blogId: blog_id,
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
