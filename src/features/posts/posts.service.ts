import { ObjectId } from "mongodb";
import { PostEntityModel, PostForBlogInputModel, PostInputModel, PostValidQueryModel, PostViewModel } from "../../input-output-types/posts-types";
import { postsRepository } from "./posts.repository";
import { blogsService } from "../blogs/blogs.service";
import { blogsRepository } from "../blogs/blogs.repository";

export const postsService = {
  async createPost(payload: PostInputModel): Promise<PostViewModel | null> {
    const blog = await blogsRepository.findBlog(payload.blogId);

    const newPost: PostEntityModel = {
      ...payload,
      blogName: blog!.name,
      createdAt: new Date().toISOString(),
    };

    const postId: string = await postsRepository.createPost(newPost);

    const post = await postsRepository.findPost(postId);

    return post;
  },

  async createForBlog(payload: PostForBlogInputModel, blog_id: string): Promise<PostViewModel | null> {
    const blog = await blogsRepository.findBlog(blog_id);

    const newPost: PostEntityModel = {
      ...payload,
      blogName: blog!.name,
      blogId: blog_id,
      createdAt: new Date().toISOString(),
    };

    const postId = await postsRepository.createPost(newPost);

    const post = await postsRepository.findPost(postId);

    return post;
  },

  async updatePost(id: string, payload: PostInputModel): Promise<boolean> {
    const isUpdated = await postsRepository.updatePost(id, payload);
    return isUpdated;
  },

  async deletePost(id: string): Promise<boolean> {
    const isDeleted = await postsRepository.deletePost(id);
    return isDeleted;
  },
};
